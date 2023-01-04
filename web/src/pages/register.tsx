import { Box, Button, Flex, Heading, Link, Spacer } from '@chakra-ui/react';
import { InputField } from 'components';
import { Form, Formik } from 'formik';
import { useRegisterMutation } from 'generated/graphql';
import { DefaultLayout } from 'layouts/default';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { createUrqlClient } from 'utils/createUrqlClient';
import { redirectToHomeIfAuthenticated } from 'utils/redirectToHomeIfAuthenticated';
import { toErrorMap } from 'utils/toErrorMap';
import NextLink from 'next/link';

interface registerProps {}

export const getServerSideProps = async (ctx: NextContext) => {
  return await redirectToHomeIfAuthenticated(ctx);
};

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  return (
    <DefaultLayout variant='small'>
      <Heading as='h4' size='md' mb={5}>
        Register
      </Heading>

      <Formik
        initialValues={{
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await register({ data: values });

          if (data?.register.errors) {
            setErrors(toErrorMap(data.register.errors));
          } else if (data?.register.user) {
            // Worked
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label='email' placeholder='email' name='email' />

            <Box mt={4}>
              <InputField
                label='username'
                placeholder='username'
                name='username'
              />
            </Box>

            <Box mt={4}>
              <InputField
                label='password'
                placeholder='password'
                name='password'
                type='password'
              />
            </Box>

            <Box mt={4}>
              <InputField
                label='Confirm password'
                placeholder='Confirm password'
                name='confirmPassword'
                type='password'
              />
            </Box>

            <Flex>
              <Button
                mt={4}
                type='submit'
                isLoading={isSubmitting}
                backgroundColor='teal'
              >
                register
              </Button>
              <Spacer />
              <Link mt={4} variant={'underline'} as={NextLink} href='/login'>
                Login
              </Link>
            </Flex>
          </Form>
        )}
      </Formik>
    </DefaultLayout>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
