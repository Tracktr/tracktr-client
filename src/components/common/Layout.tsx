import Navbar from "../navigation/Navbar";
import Footer from "./Footer";

const Layout = ({ children }: any) => (
  <div className="min-h-screen text-white bg-primaryBackground">
    <Navbar />
    {children}
    <Footer />
  </div>
);

export default Layout;
