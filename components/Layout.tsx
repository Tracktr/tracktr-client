import React from "react";
import Navbar from "../components/Navbar";

const Layout = ({ children }: any) => {
  return (
    <div className="min-h-screen text-white bg-primaryBackground">
      <Navbar />
      {children}
    </div>
  )
};

export default Layout;