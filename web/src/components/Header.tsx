import React from "react";
import { Box, Heading, Flex, Button, Link } from "@chakra-ui/core";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

interface HeaderProps {}

// Note: This code could be better, so I'd recommend you to understand how I solved and you could write yours better :)
export const Header: React.FC<HeaderProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [show, setShow] = React.useState(false);
  const router = useRouter();
  const handleToggle = () => setShow(!show);
  let body;

  if (fetching) {
    body = null;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/register">
          <Button 
            bg="sompoBlack.700"     
            _hover={{ bg: "sompoBlack.900" }}
            _focus={{ boxShadow: "outline" }}  
            mr={4}>
            Create account
          </Button>
        </NextLink>
        <NextLink href="/login">
          <Button 
            bg="sompoBlack.700"     
            _hover={{ bg: "sompoBlack.900" }}
            _focus={{ boxShadow: "outline" }}
          >
            Enter account
          </Button>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={2} mt={2} fontWeight={700}>
          {data.me.username}
        </Box>
        <Button
          onClick={async () => {
            logout();
            router.push("/login")
          }}
          bg="sompoBlack.700"     
          _hover={{ bg: "sompoBlack.900" }}
          _focus={{ boxShadow: "outline" }}  
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="sompoRed.500"
      color="white"
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
          LiReddit
        </Heading>
      </Flex>
      <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
        <svg
          fill="white"
          width="12px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>
      <Box
        display={{ sm: show ? "block" : "none", md: "flex" }}
        width={{ sm: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
      >
        <NextLink href="aboutus">
          <Link mt={{ base: 4, md: 0 }} mr={6} display="block">
            About us
          </Link>
        </NextLink>
        <NextLink href="/contact">
          <Link mt={{ base: 4, md: 0 }} mr={6} display="block">
            Contact
          </Link>
        </NextLink>
      </Box>
      <Box
        display={{ sm: show ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >
        {body}
      </Box>
    </Flex>
  );
};
