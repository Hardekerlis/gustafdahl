const { exec } = require('child_process');
const fs = require('fs');

const startDevelopmentEnv = async () => {
  if (!fs.existsSync('../node_modules')) {
    await new Promise((resolve) => {
      exec('npm ci', () => {
        resolve();
      });
    });
  }

  const Logger = require('frictionless-logger');

  const logger = new Logger.default();

  logger.info('Starting development environment');

  exec('npm run clean:build', (err, stdout, stderr) => {
    if (err) {
      logger.error(`error: ${err}`);
    }

    if (stderr) {
      logger.info(
        "Couldn't find the needed module, testing installing dependencies",
      );

      exec('npm ci', (err, stdout, stderr) => {
        if (stdout) {
          logger.info('Successfully installed dependencies');

          startDevelopmentEnv();

          return;
        }

        logger.error('Failed to installed dependencies');
      });
    }

    if (stdout) {
      logger.info('Deleted build directory');
    }
  });
};

startDevelopmentEnv();
