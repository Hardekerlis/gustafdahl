import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Block = {
  __typename?: 'Block';
  blockId: Scalars['String'];
  data: Data;
  type: Scalars['String'];
};

export type ChangePasswordInput = {
  confirmNewPassword: Scalars['String'];
  newPassword: Scalars['String'];
  token: Scalars['String'];
};

export type Data = {
  __typename?: 'Data';
  level?: Maybe<Scalars['String']>;
  text: Scalars['String'];
};

export type DataInput = {
  level?: InputMaybe<Scalars['String']>;
  text: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type ForgotPasswordResponse = {
  __typename?: 'ForgotPasswordResponse';
  errors?: Maybe<Array<FieldError>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type HealthType = {
  __typename?: 'HealthType';
  code: Scalars['String'];
  message: Scalars['String'];
  success: Scalars['Boolean'];
  uptime: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  createPost?: Maybe<PostResponse>;
  forgotPassword: ForgotPasswordResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  updatePost?: Maybe<PostResponse>;
};


export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};


export type MutationCreatePostArgs = {
  title: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationRegisterArgs = {
  data: UserRegisterInput;
};


export type MutationUpdatePostArgs = {
  data: Array<UpdatePostUpdate>;
};

export type Post = {
  __typename?: 'Post';
  blocks?: Maybe<Array<Block>>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  published?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type PostInput = {
  blockId: Scalars['String'];
  data: DataInput;
  type: Scalars['String'];
};

export type PostResponse = {
  __typename?: 'PostResponse';
  errors?: Maybe<Array<FieldError>>;
  post?: Maybe<Post>;
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
  getPost?: Maybe<Post>;
  getUser?: Maybe<UserResponse>;
  health: HealthType;
};


export type QueryGetPostArgs = {
  id: Scalars['ID'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};

export type UpdatePostUpdate = {
  id: Scalars['String'];
  post: Array<PostInput>;
  publish: Scalars['Boolean'];
  title: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']>;
  emailConfirmed?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  isAdmin: Scalars['Boolean'];
  username: Scalars['String'];
};

export type UserRegisterInput = {
  confirmPassword: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type ErrorFragmentFragment = { __typename?: 'FieldError', field: string, message: string };

export type PostFragmentFragment = { __typename?: 'Post', published?: string | null, id: string, createdAt: string, updatedAt: string, blocks?: Array<{ __typename?: 'Block', blockId: string, type: string, data: { __typename?: 'Data', level?: string | null, text: string } }> | null };

export type UserFragmentFragment = { __typename?: 'User', id: string, username: string };

export type UserResponseFragmentFragment = { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, username: string } | null };

export type ChangePasswordMutationVariables = Exact<{
  data: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, username: string } | null } };

export type CreatePostMutationVariables = Exact<{
  title: Scalars['String'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost?: { __typename?: 'PostResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, post?: { __typename?: 'Post', id: string, createdAt: string, updatedAt: string, title: string } | null } | null };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: { __typename?: 'ForgotPasswordResponse', success?: boolean | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type LoginMutationVariables = Exact<{
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, username: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  data: UserRegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: string, username: string } | null } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', isAdmin: boolean, id: string, username: string } | null };

export const PostFragmentFragmentDoc = gql`
    fragment PostFragment on Post {
  published
  id
  createdAt
  updatedAt
  blocks {
    blockId
    data {
      level
      text
    }
    type
  }
}
    `;
export const ErrorFragmentFragmentDoc = gql`
    fragment ErrorFragment on FieldError {
  field
  message
}
    `;
export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  id
  username
}
    `;
export const UserResponseFragmentFragmentDoc = gql`
    fragment UserResponseFragment on UserResponse {
  errors {
    ...ErrorFragment
  }
  user {
    ...UserFragment
  }
}
    ${ErrorFragmentFragmentDoc}
${UserFragmentFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($data: ChangePasswordInput!) {
  changePassword(data: $data) {
    ...UserResponseFragment
  }
}
    ${UserResponseFragmentFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($title: String!) {
  createPost(title: $title) {
    errors {
      ...ErrorFragment
    }
    post {
      id
      createdAt
      updatedAt
      title
    }
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    errors {
      ...ErrorFragment
    }
    success
  }
}
    ${ErrorFragmentFragmentDoc}`;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($password: String!, $usernameOrEmail: String!) {
  login(password: $password, usernameOrEmail: $usernameOrEmail) {
    ...UserResponseFragment
  }
}
    ${UserResponseFragmentFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($data: UserRegisterInput!) {
  register(data: $data) {
    ...UserResponseFragment
  }
}
    ${UserResponseFragmentFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    ...UserFragment
    isAdmin
  }
}
    ${UserFragmentFragmentDoc}`;

export function useCurrentUserQuery(options?: Omit<Urql.UseQueryArgs<CurrentUserQueryVariables>, 'query'>) {
  return Urql.useQuery<CurrentUserQuery, CurrentUserQueryVariables>({ query: CurrentUserDocument, ...options });
};