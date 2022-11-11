import Navbar from "../navigation/Navbar";
import Footer from "./Footer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Layout = ({ children }: any) => (
  <div className="min-h-screen text-white bg-primaryBackground">
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);

export default Layout;
