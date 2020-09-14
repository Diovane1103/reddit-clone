import React from 'react'
import { PostSnippetFragment } from '../generated/graphql';
import { Flex, Box, Heading, Text } from '@chakra-ui/core';
import { UpdootSection } from './UpdootSection';

interface PostProps {
    post: PostSnippetFragment;
}

export const Post: React.FC<PostProps> = ({ post }) => {
        return (
          <Flex key={post.id} p={5} shadow="md" borderWidth="1px" mb={4}>
            <UpdootSection post={post} />
            <Box>
              <Heading fontSize="xl">{post.title}</Heading>
              <Text color="#8c8c8c" fontSize="10">
                posted by {post.creator.username}
              </Text>
              <Text mt={4}>{post.textSnippet}...</Text>
            </Box>
          </Flex>
        );
}