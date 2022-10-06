import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { CgMenuGridO } from "react-icons/cg";
import NavButton from "./Navbutton";
import NavProfile from "./NavProfile";

const navLinks = [
  { href: "/movies", text: "Movies", active: false },
  { href: "/series", text: " Series", active: false },
];

const Navbar = () => {
  const { pathname } = useRouter();

  const [menu, setMenu] = useState(false);

  const openMenu = () => {
    setMenu(!menu);
  };

  if (pathname !== "/auth/signin") {
    return (
      <nav className="fixed top-0 z-50 w-screen bg-opacity-25 bg-primaryBackground filter backdrop-blur-md">
        <div className="max-w-6xl px-6 py-2 m-auto">
          <div className="grid grid-cols-3">
            <Link href="/">
              <a className="col-span-1">
                <h1 className="text-3xl font-black text-white">
                  TRACKTR
                  <span className="text-primary">.</span>
                </h1>
              </a>
            </Link>
            <ul className="items-center justify-center hidden lg:flex">
              {navLinks.map((navItem) => (
                <NavButton key={navItem.text} href={navItem.href} text={navItem.text} active={navItem.active} />
              ))}
            </ul>
            <div className="flex items-center justify-end col-span-2 lg:col-span-1">
              <button type="button" className="block cursor-pointer lg:hidden" onClick={openMenu}>
                <CgMenuGridO className="text-2xl" />
              </button>
              <NavProfile />
            </div>
          </div>
        </div>
        {menu && (
          <div className="block w-full lg:hidden">
            <ul className="flex items-center justify-center align-middle">
              {navLinks.map((navItem) => (
                <NavButton key={navItem.text} href={navItem.href} text={navItem.text} active={navItem.active} />
              ))}
            </ul>
          </div>
        )}
      </nav>
    );
  }

  return <div />;
};

export default Navbar;
