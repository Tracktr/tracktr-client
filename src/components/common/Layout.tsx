import { useRouter } from "next/router";
import Navbar from "../navigation/Navbar";
import Footer from "./Footer";

const noNavbarRoutes = ["/welcome", "/welcome/import", "/welcome/movies", "/welcome/series"];

const Layout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const router = useRouter();

  return (
    <div className="text-white bg-primaryBackground">
      {noNavbarRoutes.includes(router.route) ? (
        <nav className="fixed top-0 z-50 w-screen bg-opacity-25 bg-primaryBackground filter backdrop-blur-md">
          <div className="max-w-6xl px-6 py-2 m-auto">
            <div className="grid grid-cols-3">
              <a className="col-span-1">
                <h1 className="text-3xl font-black text-white select-none">
                  TRACKTR
                  <span className="text-primary">.</span>
                </h1>
              </a>
            </div>
          </div>
        </nav>
      ) : (
        <Navbar />
      )}
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
