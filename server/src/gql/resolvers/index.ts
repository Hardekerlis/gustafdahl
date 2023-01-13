import { NonEmptyArray } from 'type-graphql';
import { HealthResolver } from './base';
import { UserResolver, PostResolver } from './endpoints';

export const resolvers: NonEmptyArray<string> | NonEmptyArray<Function> = [
  HealthResolver,
  UserResolver,
  PostResolver,
];
