import { Box, Button, Heading } from '@chakra-ui/react';
import { InputField } from 'components';
import { Form, Formik } from 'formik';
import { useForgotPasswordMutation } from 'generated/graphql';
import { DefaultLayout } from 'layouts/default';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { createUrqlClient } from 'utils/createUrqlClient';
import { toErrorMap } from 'utils/toErrorMap';

interface ForgotPasswordProps {
  children?: React.ReactNode;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = useState(false);

  return (
    <DefaultLayout variant='small'>
      <Heading as='h4' size='md' mb={5}>
        Forgot password
      </Heading>

      <Formik
        initialValues={{
          email: '',
        }}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await forgotPassword(values);
          console.log(data);
          if (data?.forgotPassword.errors) {
            const errorMap = toErrorMap(data.forgotPassword.errors);
            setErrors(errorMap);
          } else if (data?.forgotPassword.success) {
            // Worked
            setComplete(true);
          }
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              If an account with that email exists, we sent you an email
            </Box>
          ) : (
            <Form>
              <InputField label='Email' placeholder='email' name='email' />

              <Button
                mt={4}
                type='submit'
                isLoading={isSubmitting}
                backgroundColor='teal'
              >
                Send email
              </Button>
            </Form>
          )
        }
      </Formik>
    </DefaultLayout>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
