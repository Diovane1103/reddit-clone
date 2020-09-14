import React, { useState } from "react";
import { NextPage } from "next";
import { Button, Heading, Box, Link, Flex } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { useChangePasswordMutation } from "../../generated/graphql";

import { InputField } from "../../components/InputField";
import { useRouter } from "next/router";
import { toErrorMap } from "../../utils/toErrorMap";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { Layout } from "../../components/Layout";

const ChangePassword: NextPage = ({}) => {
  const router = useRouter();
  const [{}, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Layout variant="regular">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async ({ newPassword }, { setErrors }) => {
          const response = await changePassword({
            newPassword,
            token:
              typeof router.query.token === "string" ? router.query.token : "",
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/login");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box m={4}>
              <Heading as="h2" size="xl" mb={6}>
                Change Password
              </Heading>
              <InputField
                placeholder="New Password"
                label="New Password"
                name="newPassword"
                type="password"
              />
              {tokenError ? (
                <Flex>
                  <Box style={{ color: "red" }} mr={2}>
                    {tokenError}
                  </Box>
                  <NextLink href="/forgot-password">
                    <Link>Click here, to get a new token.</Link>
                  </NextLink>
                </Flex>
              ) : null}
              <Button
                mt={6}
                mb={2}
                variantColor="sompoRed"
                isLoading={isSubmitting}
                type="submit"
              >
                Change Password
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
