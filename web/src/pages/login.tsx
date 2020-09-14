import React from "react";
import { Formik, Form } from "formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { Box, Button, Heading, Flex, Link } from "@chakra-ui/core";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { useLoginMutation } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { Layout } from "../components/Layout";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [{}, login] = useLoginMutation();
  return (
    <Layout 
      variant="small"
      shadowed
    >
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            const nextPage =
              typeof router.query.next === "string" ? router.query.next : "/";
            router.push(nextPage);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box m={4}>
              <Heading as="h2" size="xl" mb={6}>
                Login
              </Heading>
              <InputField
                placeholder="Username or Email"
                label="Username"
                name="usernameOrEmail"
              />
              <Box mt={4}>
                <InputField
                  placeholder="Password"
                  label="Password"
                  name="password"
                  type="password"
                />
              </Box>
              <Flex>
                <NextLink href="/forgot-password">
                  <Link mt={2} ml="auto">
                    forgot password?
                  </Link>
                </NextLink>
              </Flex>
              <Button
                mt={2}
                mb={2}
                variantColor="sompoRed"
                isLoading={isSubmitting}
                type="submit"
              >
                Login
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
