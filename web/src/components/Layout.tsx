import React from "react";
import { Wrapper, WrapperVariant } from "./Wrapper";
import { NavBar } from "./NavBar";
import { Header } from "./Header";

interface LayoutProps {
  variant?: WrapperVariant;
  shadowed?: Boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant, shadowed }) => {
  return (
    <>
      <Header />
      <Wrapper variant={variant} shadowed={shadowed}>{children}</Wrapper>
    </>
  );
};
