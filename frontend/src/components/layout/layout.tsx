import React from "react";
import Header from "../header/header";

const Layout = ({ children }: any) => {
  return (
    <>
      {/* <Header /> */}
      <main>{children}</main>
    </>
  );
};

export default Layout;
