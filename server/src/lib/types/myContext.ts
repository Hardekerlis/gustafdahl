import { Request, Response } from 'express';
import { RedisClient } from './redisClient';

declare global {
  namespace Express.session {
    interface session {
      userId?: string;
    }
  }
}

export type MyContext = {
  req: Request;
  res: Response;
  redis: RedisClient;
};
