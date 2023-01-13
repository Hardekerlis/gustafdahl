import { User } from 'entities';
import { FieldError } from 'gql/resolvers/lib/base-classes';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User | null;
}
