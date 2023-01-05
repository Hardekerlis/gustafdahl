import { instanceToPlain } from 'class-transformer';
import { User } from 'entities';
import { MyContext, emailValidator } from 'lib';
import { executionTimeMiddleware } from 'middleware/executionTimeMiddleware';
import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { UserResponse } from './base-classes';
import {
  ChangePasswordInput,
  ValidateChangePasswordData,
  changePassword,
} from './change-password';
import { currentUser } from './current-user';
import { ForgotPasswordResponse, forgotPassword } from './forgot-password';
import { ValidateGetUserId, getUser } from './get-user';
import { ValidateLoginData, login } from './login';
import { logout } from './logout';
import { UserRegisterInput, ValidateRegisterData, register } from './register';

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String, { nullable: true })
  async email(
    @Root() user: User,
    @Ctx() { req }: MyContext,
  ): Promise<string | null> {
    // TODO: Fix this...

    // @ts-ignore
    user = user._doc;

    //@ts-ignore
    if (req.session.userId && req.session.userId === user._id.toString()) {
      // This is the current user and it is okay to show them their own email
      return user.email;
    }

    // Current user wants to see someone elses email
    return null;
  }

  @FieldResolver(() => Boolean, { nullable: true })
  emailConfirmed(@Root() _user: User, @Ctx() { req }: MyContext) {
    let user = instanceToPlain(_user);
    console.log(user);
    // TODO: Fix this...

    // @ts-ignore
    // user = user._doc;

    // //@ts-ignore
    // if (req.session.userId && req.session.userId === user._id.toString()) {
    //   return user.emailConfirmed;
    // }

    return null;
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(executionTimeMiddleware('Get current user'))
  async currentUser(@Ctx() { req }: MyContext) {
    return await currentUser(req);
  }

  @Query(() => UserResponse, { nullable: true })
  @UseMiddleware(executionTimeMiddleware('Getting user'), ValidateGetUserId)
  async getUser(@Arg('id', () => ID) id: string) {
    return await getUser(id);
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(
    executionTimeMiddleware('User registration'),
    ValidateRegisterData,
  )
  async register(
    @Arg('data') data: UserRegisterInput,
    @Ctx() { req }: MyContext,
  ): Promise<UserResponse> {
    return await register(data, req);
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(executionTimeMiddleware('User login'), ValidateLoginData)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req, res }: MyContext,
  ): Promise<UserResponse> {
    return await login(usernameOrEmail, password, req, res);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(executionTimeMiddleware('User logout'))
  async logout(@Ctx() { req, res }: MyContext) {
    return await logout(req, res);
  }

  @Mutation(() => ForgotPasswordResponse)
  @UseMiddleware(
    executionTimeMiddleware('User forgot password'),
    emailValidator,
  )
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext,
  ) {
    return await forgotPassword(email, redis);
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(
    executionTimeMiddleware('Change password'),
    ValidateChangePasswordData,
  )
  async changePassword(
    @Arg('data') data: ChangePasswordInput,
    @Ctx() { redis }: MyContext,
  ) {
    return await changePassword(data, redis);
  }
}
