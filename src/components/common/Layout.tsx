import Navbar from "../navigation/Navbar";
import Footer from "./Footer";

const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }) => (
  <div className="text-white bg-primaryBackground">
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </div>
);

export default Layout;
