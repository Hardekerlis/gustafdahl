import { COOKIE_NAME } from 'constants/cookie-name';
import { Request, Response } from 'express';
import Logger from 'frictionless-logger';

const logger = new Logger({
  message: {
    static: {
      text: 'Logout',
    },
  },
});

export const logout = async (req: Request, res: Response) => {
  return await new Promise((resolve) => {
    req.session.destroy((err: any) => {
      if (err) {
        logger.error(
          `Threw an error when destroying session. Error message: ${err.message}`,
        );
        resolve(false);
      }
      logger.debug('Destroyed session and clearing cookie');
      res.clearCookie(COOKIE_NAME);
      resolve(true);
    });
  });
};
