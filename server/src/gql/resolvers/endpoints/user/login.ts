import { UserModel } from 'entities';
import { Request } from 'express';
import Logger from 'frictionless-logger';
import { Password } from 'lib';
import { MiddlewareFn } from 'type-graphql';
import validator from 'validator';
import { FieldError, UserResponse } from './base-classes';

const logger = new Logger({
  message: {
    static: {
      text: 'Login',
    },
  },
});

const failedLoginResponse = {
  errors: [
    {
      field: 'usernameOrEmail',
      message: 'Invalid email/password',
    },
    {
      field: 'password',
      message: 'Invalid email/password',
    },
  ],
};

export const login = async (
  usernameOrEmail: string,
  password: string,
  req: Request,
): Promise<UserResponse> => {
  logger.debug('Looking up user');
  const user = await UserModel.findOne({
    $or: [
      { email: usernameOrEmail },
      { username: usernameOrEmail.toLowerCase() },
    ],
  });

  if (!user) {
    logger.debug('No user found');
    return failedLoginResponse;
  }

  logger.debug('Comparing passwords');
  if (!(await Password.compare(user.password, password))) {
    logger.debug('Password comparison failed');
    return failedLoginResponse;
  }

  req.session!.userId = user.id;

  logger.debug('Login successful');
  return {
    user,
  };
};

export const ValidateLoginData: MiddlewareFn = async ({ args }, next) => {
  const errors: FieldError[] = [];

  const isUsername =
    validator.isAlphanumeric(args.usernameOrEmail, 'sv-SE') &&
    !validator.isEmail(args.usernameOrEmail);

  const isEmail = validator.isEmail(args.usernameOrEmail) && !isUsername;

  logger.debug(
    `Checking if ${args.usernameOrEmail} is an username or an email`,
  );
  if (!isUsername && !args.usernameOrEmail.includes('@')) {
    logger.debug('Username is invalid');
    errors.push({
      field: 'usernameOrEmail',
      message: 'Invalid username',
    });
  } else if (!isEmail && !isUsername) {
    logger.debug('Email is invalid');
    errors.push({
      field: 'usernameOrEmail',
      message: 'Invalid email',
    });
  }

  logger.info('Attempting to authenticate user');

  if (errors[0]) {
    return {
      errors,
    };
  }

  return await next();
};
