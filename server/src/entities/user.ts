import {
  ModelOptions,
  Prop,
  getModelForClass,
  pre,
} from '@typegoose/typegoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Password } from 'lib';
import { Field, ID, ObjectType } from 'type-graphql';

interface UserAttributes {
  email: string;
  username: string;
  emailConfirmed?: boolean;
  password: string;
}

class DocumentCT {
  @Expose()
  @Transform((value) => {
    if ('value' in value && value.value) {
      return value.obj[value.key].toString();
    }

    return 'unknown value';
  })
  public id: string;

  @Expose()
  public __v: number;
}

@pre<User>('save', async function () {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
})
@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'users',
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
@Exclude()
class User extends DocumentCT {
  @Field(() => ID)
  public id: string;

  @Expose()
  @Field({ nullable: true })
  @Prop({ required: true, type: String, unique: true })
  public email: string;

  @Expose()
  @Field()
  @Prop({ required: true, type: String, unique: true })
  public username: string;

  @Expose()
  @Field({ nullable: true })
  @Prop({ type: Boolean, default: false })
  public emailConfirmed: boolean;

  @Expose()
  @Prop({ type: String, required: true })
  public password: string;

  @Expose()
  @Prop({ type: Date, default: null })
  public lastPasswordReset: Date;

  public static build(attribites: UserAttributes) {
    const UserModel = getModelForClass(User);

    return new UserModel(attribites);
  }
}

const UserModel = getModelForClass(User);

export { UserModel, User };
