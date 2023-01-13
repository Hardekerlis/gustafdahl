import { ModelOptions, getModelForClass, prop } from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';

export interface DataAttributes {
  text: string;
  level?: string;
}

export interface BlockAttributes {
  blockId: string;
  type: string;
  data: DataAttributes;
}

export interface PostAttributes {
  blocks?: BlockAttributes[];
  published?: string;
  title: string;
}

@ObjectType()
class Data {
  @Field()
  @prop({ required: true })
  public text: string;

  @Field({ nullable: true })
  @prop()
  public level?: string;
}

@ObjectType()
class Block {
  @Field()
  @prop({ required: true })
  public blockId: string;

  @Field()
  @prop({ required: true })
  public type: string;

  @Field(() => Data)
  @prop()
  public data: Data;
}

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'posts',
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;

        delete ret.id;
        delete ret.password;
        delete ret.__v;
      },
    },
    toObject: {
      transform(_, ret) {
        ret.id = ret._id;

        delete ret.id;
        delete ret.password;
        delete ret.__v;
      },
    },
  },
})
@ObjectType()
class Post {
  @Field(() => ID)
  public id: string;

  @Field((type) => [Block], { nullable: true })
  @prop({ default: [] })
  public blocks?: Block[];

  @Field({ nullable: true })
  @prop({ type: String, default: null })
  public published?: string;

  @Field()
  @prop({ type: String, required: true })
  public title: string;

  @Field()
  public createdAt: string;

  @Field()
  public updatedAt: string;

  public static build(attribites: PostAttributes) {
    const PostModel = getModelForClass(Post);

    return new PostModel(attribites);
  }
}

const PostModel = getModelForClass(Post);

export { PostModel, Post };
