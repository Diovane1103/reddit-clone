import React from "react";
import { Formik, Form } from "formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { Box, Button, Heading } from "@chakra-ui/core";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [{}, register] = useRegisterMutation();
  return (
    <Layout 
      variant="small"
      shadowed
    >
      <Formik
        initialValues={{ username: "", password: "", email: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box m={4}>
            <Heading as="h2" size="xl" mb={6}>
              Register
            </Heading>
            <InputField
              placeholder="Username"
              label="Username"
              name="username"
            />
            <Box mt={4}>
              <InputField
                placeholder="Email"
                label="Email"
                name="email"
                type="email"
              />
            </Box>
            <Box mt={4}>
              <InputField
                placeholder="Password"
                label="Password"
                name="password"
                type="password"
              />
            </Box>
            <Button
              mt={6}
              mb={2}
              variantColor="sompoRed"
              isLoading={isSubmitting}
              type="submit"
            >
              Register
            </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
