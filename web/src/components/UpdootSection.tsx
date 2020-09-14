import React from "react";
import { Flex, IconButton, Text } from "@chakra-ui/core";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [{}, vote] = useVoteMutation();

  return (
    <Flex direction="column" alignItems="center" justifyContent="center" mr={4}>
      <IconButton
        icon="chevron-up"
        aria-label="up-vote"
        bg="#ffffff"
        onClick={() =>
          vote({
            postId: post.id,
            value: 1,
          })
        }
      />
      <Text color="#8c8c8c" fontSize="16">
        {post.points}
      </Text>
      <IconButton
        icon="chevron-down"
        aria-label="down-vote"
        bg="#ffffff"
        onClick={() =>
          vote({
            postId: post.id,
            value: -1,
          })
        }
      />
    </Flex>
  );
};
