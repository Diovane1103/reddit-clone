import React from 'react'
import { Box } from '@chakra-ui/core';

export type WrapperVariant = "small" | "regular"

interface WrapperProps {
  variant?: WrapperVariant;
  shadowed?: Boolean;
}

export const Wrapper: React.FC<WrapperProps> = ({ 
    children, 
    variant = "regular",
    shadowed = false
}) => {
  return (
    <Box
      mt={8}
      mx="auto"
      maxW={variant === "regular" ? "800px" : "400px"}
      borderRadius={ shadowed ? 8 : 0 }
      shadow={ shadowed ? "lg" : 0 }
      w="100%"
    >
      {children}
    </Box>
  );
};