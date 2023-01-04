import { Box, Button, Flex, Heading, Link, Spacer } from '@chakra-ui/react';
import { InputField } from 'components';
import { Form, Formik } from 'formik';
import { useCurrentUserQuery, useLoginMutation } from 'generated/graphql';
import { DefaultLayout } from 'layouts/default';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { createUrqlClient } from 'utils/createUrqlClient';
import { isServer } from 'utils/isServer';
import { redirectToHomeIfAuthenticated } from 'utils/redirectToHomeIfAuthenticated';
import { toErrorMap } from 'utils/toErrorMap';

export const getServerSideProps = async (ctx: NextContext) => {
  return await redirectToHomeIfAuthenticated(ctx);
};

const Login: React.FC<{}> = () => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  const [wrongPasswordCount, setWrongPasswordCount] = useState(0);
  const [{ data: _data }] = useCurrentUserQuery({
    pause: !isServer(),
  });

  useEffect(() => {
    const next = router.query.next as string;

    if (_data?.currentUser) {
      if (typeof next === 'string') {
        router.push(next);
      } else {
        router.push('/');
      }
    }
  }, [router]);

  return (
    <>
      <DefaultLayout variant='small'>
        <Heading as='h4' size='md' mb={5}>
          Login
        </Heading>

        <Formik
          initialValues={{ usernameOrEmail: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            const { data } = await login(values);

            if (data?.login.errors) {
              const errorMap = toErrorMap(data.login.errors);

              if ('password' in errorMap) {
                setWrongPasswordCount(wrongPasswordCount + 1);
              }

              setErrors(errorMap);
            } else if (data?.login.user) {
              const next = router.query.next;
              // Worked
              if (typeof next === 'string') {
                router.push(next);
              } else {
                router.push('/');
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                label='username or email'
                placeholder='username or email'
                name='usernameOrEmail'
              />
              <Box mt={4}>
                <InputField
                  label='password'
                  placeholder='password'
                  name='password'
                  type='password'
                />
                {wrongPasswordCount >= 3 ? (
                  <Box>
                    <Link
                      as={NextLink}
                      href='/forgot-password'
                      fontSize={'12'}
                      color='blue.300'
                    >
                      Forgot your password?
                    </Link>
                  </Box>
                ) : null}
              </Box>
              <Flex>
                <Button
                  mt={4}
                  type='submit'
                  isLoading={isSubmitting}
                  backgroundColor='teal'
                >
                  login
                </Button>
                <Spacer />
                <Link
                  mt={4}
                  variant={'underline'}
                  as={NextLink}
                  href='/register'
                >
                  Register
                </Link>
              </Flex>
            </Form>
          )}
        </Formik>
      </DefaultLayout>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
