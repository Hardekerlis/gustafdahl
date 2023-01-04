import { Resolver, Query, ObjectType, Field } from 'type-graphql';

import { RequestResponse } from './lib';

@ObjectType()
class HealthType implements RequestResponse {
  @Field()
  code: string;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field()
  uptime: string;
}

@Resolver()
export class HealthResolver {
  @Query(() => HealthType)
  health() {
    const start = parseInt(process.env.SERVER_START_TIME!);
    const now = +new Date();

    const diff = now - start;

    let hours = Math.floor(diff / 3.6e6) + '';
    let minutes = Math.floor((diff % 3.6e6) / 6e4) + '';
    let seconds = Math.floor((diff % 6e4) / 1000) + '';

    if (hours.length === 1) hours = `0${hours}`;
    if (minutes.length === 1) minutes = `0${minutes}`;
    if (seconds.length === 1) seconds = `0${seconds}`;

    return {
      uptime: `${hours}:${minutes}:${seconds}`,
      code: '200',
      success: true,
      message: 'Server is running',
    };
  }
}
