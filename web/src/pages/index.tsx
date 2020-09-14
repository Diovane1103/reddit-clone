import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import { Stack, Box, Heading, Button, Flex } from "@chakra-ui/core";
import { useState } from "react";
import { Post } from "../components/Post";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });

  if (!fetching && !data) {
    return <Box>you got no data yet.</Box>;
  }

  return (
    <Layout variant="regular">
      <Box m={4}>
        <Flex>
          <Heading>LiReddit</Heading>
          <NextLink href="/create-post">
            <Button mb={4} mt={2} ml="auto" variantColor="sompoRed">
              Create Post
            </Button>
          </NextLink>
        </Flex>
        {!data && fetching ? (
          <Box>Loading...</Box>
        ) : (
          <Stack spacing={8}>
            {data!.posts.posts.map((p) => (
                <Post post={p} />
            ))}
          </Stack>
        )}
        {data && data.posts.hasMore ? (
          <Flex>
            <Button
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                });
              }}
              isLoading={fetching}
              m="auto"
              variantColor="sompoRed"
              my={4}
            >
              Load More
            </Button>
          </Flex>
        ) : null}
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
