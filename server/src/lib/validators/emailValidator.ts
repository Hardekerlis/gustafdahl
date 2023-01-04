import { MiddlewareFn } from 'type-graphql';
import validator from 'validator';

export const emailValidator: MiddlewareFn = async ({ args }, next) => {
  if (!validator.isEmail(args.email)) {
    return {
      errors: [
        {
          field: 'email',
          message: 'Email is invalid',
        },
      ],
    };
  }

  return await next();
};
