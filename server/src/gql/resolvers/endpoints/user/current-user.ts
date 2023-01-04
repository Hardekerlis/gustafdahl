import { logger } from '@typegoose/typegoose/lib/logSettings';
import { User, UserModel } from 'entities';
import { Request } from 'express';

export const currentUser = async (req: Request): Promise<User | null> => {
  if (req.session && !req.session.userId) {
    return null;
  }

  try {
    logger.debug('Getting user from db');
    const user = await UserModel.findById(req.session.userId);

    return user;
  } catch (err: any) {
    return null;
  }
};
