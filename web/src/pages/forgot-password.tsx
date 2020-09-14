import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { Button, Heading, Box, Text } from "@chakra-ui/core";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [{}, forgotPassword] = useForgotPasswordMutation();

  return (
    <Layout 
      variant="small"
      shadowed
    >
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box m={4}>
              <Text fontWeight={600} fontFamily="Monserrat" fontSize={14}>if an account with that email exists, we sent you an email.</Text>
            </Box>
          ) : (
            <Form>
              <Box m={4}>
                <Heading as="h2" size="xl" mb={6}>
                  Forgot Password
                </Heading>
                <InputField placeholder="Email" label="Email" name="email" />
                <Button
                  mt={6}
                  mb={2}
                  variantColor="sompoRed"
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Forgot Password
                </Button>
              </Box>
            </Form>
          )
        }
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
