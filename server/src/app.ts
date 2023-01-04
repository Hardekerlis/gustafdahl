// --- NPM Libraries ---
import { json, urlencoded } from 'body-parser';
import 'reflect-metadata';
import redisConnect from 'connect-redis';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import 'express-async-errors';
import session from 'express-session';
import Logger, { FileSizeUnits, LoggerOptions } from 'frictionless-logger';
import * as fs from 'fs';
import { startGraphQlServer } from 'gql';
import mongoose from 'mongoose';
import path from 'path';
import Redis from 'ioredis';

import { COOKIE_NAME } from 'constants/cookie-name';
import { config, ConfigHandler, errorHandler, NotFoundError } from 'lib';

const RedisStore = redisConnect(session);
const redisClient = new Redis();

const waitForFileExists = async (
  filePath: string,
  currentTime = 0,
  timeout = 5000,
): Promise<Function | boolean> => {
  if (fs.existsSync(filePath)) return true;
  if (currentTime === timeout) return false;
  // wait for 1 second
  await new Promise((resolve: Function) =>
    setTimeout(() => resolve(true), 1000),
  );
  // waited for 1 second
  return waitForFileExists(filePath, currentTime + 1000, timeout);
};

const main = async () => {
  process.env.PARENT_FOLDER = path.basename(path.dirname(__filename));

  const configPath = path.join(
    __dirname.substring(0, __dirname.indexOf(`/${process.env.PARENT_FOLDER}`)),
    `/config/config.${
      process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
    }.yml`,
  );

  const rootPath = __dirname.substring(
    0,
    __dirname.indexOf(`/${process.env.PARENT_FOLDER}`),
  );

  await ConfigHandler.loadConfig(configPath);

  // TODO: Setup jwt key for production
  process.env.JWT_KEY = 'testing';

  if (config.dev === false) {
    new Logger(
      Logger.combine(config.logger, {
        file: {
          absolutePath: rootPath,
          dirname: 'logs',
          maxFileSize: { value: 10, unit: FileSizeUnits.MB },
        },
        showSourceFile: false,
      }) as LoggerOptions,
      true,
    );
  }

  const logger = new Logger({
    message: {
      static: {
        text: 'Startup',
      },
    },
  });

  // This is necessary for production build. The log file is not created in
  // time for logs to be written to it
  if (
    !config.dev &&
    !(await waitForFileExists(path.join(rootPath, '/logs/current.log')))
  ) {
    logger.error(
      "Couldn't find log file. If this is because it couldn't be created or not be found is not known",
      {
        force: true,
      },
    );
    logger.warn('Shutting down server ...', {
      force: true,
    });
    return;
  }

  let corsOptions: CorsOptions;

  // if (config.dev) {
    corsOptions = {
      credentials: true,
      origin: 'http://localhost:3000',
    };
  // } else {
    // corsOptions = {
    //   credentials: true,
    //   // TODO: Add origin url here
    //   origin: 'URL',
    // };
    //   (origin: string | undefined, callback: Function) => {
    //     if (origin) {
    //       if (whitelist.indexOf(origin) !== -1) {
    //         callback(null, true);
    //         return;
    //       }
    //     }
    //
    //     console.log(origin);
    //
    //     callback(new Error('Not allowed by CORS'));
    //   },
    // };
  // }

  const app = express();

  app.use(cors<cors.CorsRequest>(corsOptions));
  app.use(urlencoded({ extended: false }));
  app.use(json());

  app.use(
    session({
      name: COOKIE_NAME,
      // disble touch wont scale very well
      // see https://github.com/tj/connect-redis#disabletouch
      // @ts-ignore
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      secret: 'jksadkjlsdakljdsaklj',
      resave: false,
      cookie: config.cookies,
      saveUninitialized: false,
    }),
  );

  const server = await startGraphQlServer(app, redisClient);

  // ---  These middlewares has to be applied after graphql express ---
  app.all('*', async () => {
    throw new NotFoundError();
  });

  app.use(errorHandler);
  // ------------------------------------------------------------------

  logger.info('Starting server...');

  if (config.dev) {
    logger.warn(
      'The application is in dev mode. If this is an production environment please change dev to false in the config',
      {
        force: true,
      },
    );
  }

  if (config.mongodb && config.mongodb.enabled) {
    logger.lineBreak();
    logger.info('Attempting to connect to MongoDB');

    try {
      await mongoose.connect(
        `mongodb://${config.mongodb.uri}:${config.mongodb.port}`,
        {
          dbName: config.mongodb.name,
        },
      );
      logger.info('Successfully connected to MongoDB');
    } catch (err) {
      logger.error('Failed to establish a connection to MongoDB', {
        force: true,
      });
      console.log(err);
      return;
    }
  }

  server.listen(config.port, () => {
    process.env.SERVER_START_TIME = `${+new Date()}`;

    logger.lineBreak();
    logger.info(`Server ready at http://localhost:${config.port}/`, {
      force: true,
    });

    if (config.graphql && config.graphql.enabled) {
      logger.info(
        `GraphQL server ready at http://localhost:${config.port}${config.graphql.uri}`,
        {
          force: true,
        },
      );
    } else {
      logger.debug('GraphQL is not enabled in the config', {
        force: true,
      });
    }
    logger.lineBreak();
  });
};

main();
