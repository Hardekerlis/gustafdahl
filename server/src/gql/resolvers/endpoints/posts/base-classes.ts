import { Post } from 'entities/post';
import { FieldError } from 'gql/resolvers/lib/base-classes';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PostResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Post, { nullable: true })
  post?: Post | null;
}
