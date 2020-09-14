import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import { Heading, Box, Button } from "@chakra-ui/core";
import { InputField } from "../components/InputField";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { useIsAuth } from "../utils/userIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [{}, createPost] = useCreatePostMutation();
  return (
    <Layout 
      variant="small"
      shadowed
    >
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box m={4}>
            <Heading as="h2" size="xl" mb={6}>
              Create Post
            </Heading>
            <InputField placeholder="Title" label="Title" name="title" />
            <Box mt={4}>
              <InputField
                placeholder="text..."
                label="Body"
                name="text"
                textarea
              />
            </Box>
            <Button
              mt={2}
              mb={2}
              variantColor="sompoRed"
              isLoading={isSubmitting}
              type="submit"
            >
              Create
            </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
