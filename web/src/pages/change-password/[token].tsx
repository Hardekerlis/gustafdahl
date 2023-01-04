import { Box, Button, Heading, Link } from '@chakra-ui/react';
import { InputField } from 'components';
import { Form, Formik } from 'formik';
import { useChangePasswordMutation } from 'generated/graphql';
import { DefaultLayout } from 'layouts/default';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { createUrqlClient } from 'utils/createUrqlClient';
import { toErrorMap } from 'utils/toErrorMap';

const ChangePassword: NextPage<{ token: string }> = ({}) => {
  const router = useRouter();
  const { token } = router.query;
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');

  return (
    <DefaultLayout variant='small'>
      <Heading as='h4' size='md' mb={5}>
        Reset password
      </Heading>

      <Formik
        initialValues={{
          newPassword: '',
          confirmNewPassword: '',
        }}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await changePassword({
            data: {
              newPassword: values.newPassword,
              confirmNewPassword: values.confirmNewPassword,
              token: typeof token === 'string' ? token : '',
            },
          });
          if (data?.changePassword.errors) {
            const errorMap = toErrorMap(data.changePassword.errors);

            if ('token' in errorMap) {
              setTokenError(errorMap.token);
            }

            setErrors(errorMap);
          } else if (data?.changePassword.user) {
            // Worked
            router.push('/login');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label='New password'
              placeholder='new password'
              name='newPassword'
              type='password'
            />

            <Box mt={4}>
              <InputField
                label='Confirm new password'
                placeholder='Confirm new password'
                name='confirmNewPassword'
                type='password'
              />
            </Box>
            {tokenError ? (
              <>
                <Box color='red'>{tokenError}</Box>
                <Box>
                  <Link
                    as={NextLink}
                    href='/forgot-password'
                    fontSize={'12'}
                    color='blue.300'
                  >
                    Token expired? No worries, click here
                  </Link>
                </Box>{' '}
              </>
            ) : null}

            <Button
              mt={4}
              type='submit'
              isLoading={isSubmitting}
              backgroundColor='teal'
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </DefaultLayout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
