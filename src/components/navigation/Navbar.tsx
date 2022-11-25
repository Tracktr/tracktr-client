import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Logo from "../common/Logo";
import NavButton from "./Navbutton";
import { BiMenuAltRight } from "react-icons/bi";
import NavMobile from "./NavMobile";
import ImageWithFallback from "../common/ImageWithFallback";
import { SignupWindow } from "../../pages/google-signin";

export const navLinks = [
  { href: "/movies", text: "Movies", active: false },
  { href: "/tv", text: " Series", active: false },
];

const subLinks = [
  { href: "/profile", text: "Profile" },
  { href: "/profile/history", text: "History" },
  { href: "/profile/watchlist", text: "Watchlist" },
];

const subMenuAnimate = {
  enter: {
    height: "auto",
    opacity: 1,
    rotateX: 0,
    transition: {
      duration: 0.25,
    },
    display: "block",
  },
  exit: {
    height: 0,
    opacity: 0,
    rotateX: -15,
    transition: {
      duration: 0.25,
      delay: 0.3,
    },
    transitionEnd: {
      display: "none",
    },
  },
};

const Navbar = () => {
  const { data: session, status } = useSession();
  const [profileHover, setProfileHover] = useState(false);
  const [navMobile, setNavMobile] = useState(false);

  const toggleProfileHover = () => {
    setProfileHover(!profileHover);
  };

  const toggleNavMobile = () => {
    setNavMobile(!navMobile);
  };

  useEffect(() => {
    if (navMobile) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [navMobile]);

  return (
    <>
      <nav className="fixed top-0 z-50 w-screen bg-opacity-25 bg-primaryBackground filter backdrop-blur-md">
        <div className="max-w-6xl px-6 py-2 m-auto">
          <div className="grid grid-cols-3">
            <Logo textColor="text-white" dotColor="text-primary" signedIn={status === "authenticated"} />
            <ul className="items-center justify-center hidden lg:flex">
              {navLinks.map((navItem) => (
                <NavButton key={navItem.text} href={navItem.href} text={navItem.text} active={navItem.active} />
              ))}
            </ul>
            <div className="flex items-center justify-end col-span-2 lg:col-span-1">
              {status !== "loading" && (
                <>
                  <div className="hidden mr-6 lg:mr-0 lg:block">
                    {session ? (
                      <motion.div
                        className="relative"
                        onMouseEnter={toggleProfileHover}
                        onMouseLeave={toggleProfileHover}
                      >
                        <button type="button" className="w-full h-full">
                          <a className="flex items-center pl-4">
                            <ImageWithFallback
                              unoptimized
                              src={session.user?.image ? session.user.image : ""}
                              fallbackSrc="/placeholder_profile.png"
                              width="36px"
                              height="36px"
                              className="rounded-full"
                              alt="User profile image"
                            />
                            <p className="ml-2 text-sm">{session.user?.name}</p>
                          </a>
                        </button>
                        <motion.div
                          initial="exit"
                          animate={profileHover ? "enter" : "exit"}
                          variants={subMenuAnimate}
                          className="absolute z-50 w-full rounded-md shadow-md top-10 bg-primaryBackground"
                        >
                          <div className="p-2 text-sm">
                            {subLinks.map((item) => (
                              <Link key={item.href} href={item.href}>
                                <a className="block w-full p-2 mb-1 text-left rounded-md hover:bg-zinc-800">
                                  {item.text}
                                </a>
                              </Link>
                            ))}
                            <button
                              onClick={() => signOut()}
                              className="block w-full p-2 text-left rounded-md hover:bg-zinc-800"
                            >
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <li className={`inline-block text-white list-none group`}>
                        <button onClick={() => SignupWindow()}>
                          <a className={`group-hover:text-primary px-4 py-2 inline-block`}>Sign in</a>
                        </button>
                      </li>
                    )}
                  </div>
                  <div className="flex lg:hidden">
                    <button onClick={() => setNavMobile(!navMobile)}>
                      <BiMenuAltRight className="text-3xl text-white" />
                    </button>
                    {navMobile && <NavMobile submenuItems={subLinks} toggleNavMobile={toggleNavMobile} />}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
