import { InputType, Field, MiddlewareFn } from 'type-graphql';
import { PostResponse } from './base-classes';

@InputType()
class DataInput {
  @Field()
  text: string;

  @Field({ nullable: true })
  level?: string;
}

@InputType()
class PostInput {
  @Field()
  blockId: string;

  @Field()
  type: string;

  @Field(() => DataInput)
  data: DataInput;
}

@InputType()
export class UpdatePostUpdate {
  @Field()
  public publish: boolean;

  @Field()
  public title: string;

  @Field()
  public id: string;

  @Field(() => [PostInput])
  public post: PostInput[];
}

export const updatePost = async (args: UpdatePostUpdate[]): Promise<PostResponse> => {
  console.log(args);
};

export const ValidateUpdatePost: MiddlewareFn = async (
  { args: { data } },
  next,
) => {
  return await next();
};
