import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { __PROD__ } from 'constants/env';
import { Express } from 'express';
import Logger from 'frictionless-logger';
import { resolvers } from 'gql/resolvers';
import http, { Server } from 'http';
import { config, MyContext, RedisClient } from 'lib';
import { buildSchema } from 'type-graphql';

const startGraphQlServer = async (
  app: Express,
  redis: RedisClient,
): Promise<Server> => {
  const logger = new Logger({
    message: {
      static: {
        text: 'GraphQL Startup',
      },
    },
  });

  logger.debug('Setting up http server');
  const httpServer = http.createServer(app);

  if (config.graphql && config.graphql.enabled) {
    logger.debug('Creating GraphQL server');
    const graphqlServer = new ApolloServer<MyContext>({
      includeStacktraceInErrorResponses: !__PROD__,
      introspection: true,
      schema: await buildSchema({
        resolvers: resolvers,
        validate: false,
      }),
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        __PROD__
          ? ApolloServerPluginLandingPageProductionDefault()
          : ApolloServerPluginLandingPageLocalDefault({
              footer: false,
              includeCookies: true,
            }),
      ],
    });

    logger.info('Starting GraphQL server');
    await graphqlServer.start();

    logger.info('Registering GraphQL express middleware');
    app.use(
      config.graphql.uri ? config.graphql.uri : '/graphql',
      expressMiddleware(graphqlServer, {
        context: async ({ req, res }): Promise<MyContext> => ({
          req,
          res,
          redis,
        }),
      }),
    );
  }

  return httpServer;
};

export { startGraphQlServer };
