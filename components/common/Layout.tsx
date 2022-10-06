import Navbar from "../navigation/NavBar";

const Layout = ({ children }: any) => (
  <div className="min-h-screen text-white bg-primaryBackground">
    <Navbar />
    {children}
  </div>
);

export default Layout;
