import { Post } from 'entities/post';
import { executionTimeMiddleware } from 'middleware/executionTimeMiddleware';
import {
  Arg,
  ID,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { PostResponse } from './base-classes';
import { ValidateCreatePost, createPost } from './create';
import { ValidateGetPostId, getPost } from './get-post';
import { ValidateUpdatePost, updatePost, UpdatePostUpdate } from './update';

@Resolver(Post)
export class PostResolver {
  @Query(() => Post, { nullable: true })
  @UseMiddleware(executionTimeMiddleware('Get a post'), ValidateGetPostId)
  async getPost(@Arg('id', () => ID) id: string) {
    return await getPost(id);
  }

  // TODO: Make admin only
  @Mutation(() => PostResponse, { nullable: true })
  @UseMiddleware(executionTimeMiddleware('Post creation'), ValidateCreatePost)
  async createPost(@Arg('title') title: string) {
    return await createPost(title);
  }

  @Mutation(() => PostResponse, { nullable: true })
  @UseMiddleware(executionTimeMiddleware('Post update'), ValidateUpdatePost)
  async updatePost(
    @Arg('data', (type) => [UpdatePostUpdate]) data: UpdatePostUpdate[],
  ) {
    return await updatePost(data);
  }
}
