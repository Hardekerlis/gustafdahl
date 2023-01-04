import { FORGET_PASSWORD_PREFIX } from 'constants/forgot-password-prefix';
import { UserModel } from 'entities';
import Logger from 'frictionless-logger';
import { config, RedisClient, sendEmail } from 'lib';
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';
import { Field, ObjectType } from 'type-graphql';
import { FieldError } from './base-classes';

const logger = new Logger({
  message: {
    static: {
      text: 'Forgot password',
    },
  },
});

@ObjectType()
export class ForgotPasswordResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Boolean, { nullable: true })
  success?: boolean;
}

export const forgotPassword = async (email: string, redis: RedisClient) => {
  logger.debug('Looking up user');
  const user = await UserModel.findOne({ email });

  if (!user) {
    logger.debug('No user found');
    // user is not in db
    return {
      success: true,
    };
  }

  logger.debug(`Checking last password reset for user ${user.id}`);
  if (user.lastPasswordReset) {
    const userLastPasswordReset = DateTime.fromJSDate(user.lastPasswordReset);

    const minutes = DateTime.now().diff(
      userLastPasswordReset,
      'minutes',
    ).minutes;

    if (minutes <= config.password.reset.linkCooldownMinutes) {
      logger.debug(
        `User ${user.id} has already requested a password reset link the last hour`,
      );

      await sendEmail(
        email,
        `<p>You have already requested a reset password link. Please check your inbox or wait ${Math.round(
          config.password.reset.linkCooldownMinutes - minutes,
        )} minutes to request another one.</p><br><p>If this wasn't you please disregard this email</p>`,
      );

      return {
        success: true,
      };
    }

    logger.debug('User is allowed to request another link');
  }

  const token = await nanoid();

  logger.debug('Saving token in Redis');

  await redis.set(
    `${FORGET_PASSWORD_PREFIX} ${token}`,
    `${user.id}`,
    'EX',
    1000 * 60 * 60, // 1 hour
  );

  user.lastPasswordReset = DateTime.now().toJSDate();
  await user.save();

  logger.debug('Sending email');
  await sendEmail(
    email,
    `<a href="${config.frontend.url}/change-password/${token}">reset password</a><br><p>If this wasn't you please disregard this email</p>`,
  );

  logger.debug('Email sent');
  return { success: true };
};
