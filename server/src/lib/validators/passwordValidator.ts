import Logger from 'frictionless-logger';
import { FieldError } from 'gql/resolvers/lib/base-classes';
import { config } from 'lib';
import validator from 'validator';

interface Options {
  passwordName?: string;
  confirmPasswordName?: string;
}

export const passwordValidator = (
  password: string,
  confirmPassword: string,
  logger: Logger,
  opts?: Options,
): FieldError[] => {
  const errors: FieldError[] = [];
  logger.debug('Validating password strength');
  if (
    !validator.isStrongPassword(password, {
      ...config.password,
    })
  ) {
    logger.debug('Password validation failed');

    let passwordRules = '';

    for (const rule in config.password) {
      passwordRules += `${rule}: ${config.password[rule]}, `;
    }

    errors.push({
      field: opts && opts.passwordName ? opts.passwordName : 'password',
      message: `The password must follow the following rules: ${passwordRules}`,
    });
  }

  logger.debug('Checking if password and confirm password match');
  if (!validator.equals(password, confirmPassword)) {
    logger.debug('Passwords dont match');

    errors.push({
      field:
        opts && opts.confirmPasswordName
          ? opts.confirmPasswordName
          : 'confirmPassword',
      message: "The passwords doesn't match",
    });
  }

  return errors;
};
