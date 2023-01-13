import { MiddlewareFn } from 'type-graphql';
import { PostResponse } from './base-classes';
import { PostModel } from 'entities/post';

export const createPost = async (title: string): Promise<PostResponse> => {
  console.log(title);

  const post = PostModel.build({
    title: title,
  });

  await post.save();

  // const post = PostModel.build({
  //   blocks: args.post,
  //   title: args.title,
  //   published: args.publish ? `${+new Date()}` : undefined,
  // });

  // await post.save();

  return {
    post,
  };
};

export const ValidateCreatePost: MiddlewareFn = async (
  { args: { data } },
  next,
) => {
  console.log('IMPLEMENT ME');
  // const errors: FieldError[] = [];

  // if (!validator.isAlphanumeric(data.blockId)) {
  //   errors.push({
  //     field: 'blockId',
  //     message: 'Invalid block id',
  //   });
  // }

  // if (!validator.isAlpha(data.type)) {
  //   errors.push({
  //     field: 'type',
  //     message: 'Invalid type',
  //   });
  // }

  return await next();
};
