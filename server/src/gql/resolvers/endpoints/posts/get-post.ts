import { PostModel } from 'entities/post';
import { MiddlewareFn } from 'type-graphql';
import validator from 'validator';

export const getPost = async (id: string) => {
  const post = await PostModel.findById(id);

  if (!post) return null;

  return post;
};

export const ValidateGetPostId: MiddlewareFn = async ({ args }, next) => {
  if (!validator.isMongoId(args.id)) {
    return {
      errors: [
        {
          field: 'id',
          message: 'Invalid id',
        },
      ],
    };
  }

  return await next();
};
