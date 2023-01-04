import { Field, InterfaceType } from 'type-graphql';

@InterfaceType()
export abstract class RequestResponse {
  @Field()
  code?: string;

  @Field()
  success?: boolean;

  @Field()
  message?: string;
}
