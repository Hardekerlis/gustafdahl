import { cacheExchange } from '@urql/exchange-graphcache';
import {
  ChangePasswordMutation,
  CurrentUserDocument,
  CurrentUserQuery,
  LoginMutation,
  LogoutMutation,
  RegisterMutation,
} from 'generated/graphql';
import Router from 'next/router';
import { dedupExchange, Exchange, fetchExchange } from 'urql';
import { pipe, tap } from 'wonka';
import { betterUpdateQuery } from './betterUpdateQuery';

const errorExchange: Exchange =
  ({ forward }) =>
  ops$ => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error) {
          if (error.message.toLowerCase().includes('not authenticated')) {
            if (!Router.query.next) {
              const path = `/login?next=${encodeURIComponent(Router.pathname)}`;
              Router.replace(path);
            }
          }
        }
      }),
    );
  };

export const createUrqlClient = (ssrExchange: any, ctx: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
    headers: {
      cookie: ctx && ctx.req ? ctx.req.headers.cookie : '',
    },
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          changePassword: (_result, _, cache) => {
            betterUpdateQuery<ChangePasswordMutation, CurrentUserQuery>(
              cache,
              { query: CurrentUserDocument },
              _result,
              () => ({ currentUser: null }),
            );
          },

          logout: (_result, _, cache) => {
            betterUpdateQuery<LogoutMutation, CurrentUserQuery>(
              cache,
              { query: CurrentUserDocument },
              _result,
              () => ({ currentUser: null }),
            );
          },

          login: (_result, _, cache) => {
            betterUpdateQuery<LoginMutation, CurrentUserQuery>(
              cache,
              { query: CurrentUserDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    currentUser: result.login.user,
                  };
                }
              },
            );
          },

          register: (_result, _, cache) => {
            betterUpdateQuery<RegisterMutation, CurrentUserQuery>(
              cache,
              { query: CurrentUserDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    currentUser: result.register.user,
                  };
                }
              },
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
