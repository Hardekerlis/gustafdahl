import { NonEmptyArray } from 'type-graphql';
import { HealthResolver } from './base';
import { UserResolver } from './endpoints';

export const resolvers: NonEmptyArray<string> | NonEmptyArray<Function> = [
  HealthResolver,
  UserResolver,
];
