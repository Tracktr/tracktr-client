import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Logo from "../common/Logo";
import NavButton from "./Navbutton";

const navLinks = [
  { href: "/movies", text: "Movies", active: false },
  { href: "/tv", text: " Series", active: false },
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

  const toggleProfileHover = () => {
    setProfileHover(!profileHover);
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-screen bg-opacity-25 bg-primaryBackground filter backdrop-blur-md">
        <div className="max-w-6xl px-6 py-2 m-auto">
          <div className="grid grid-cols-3">
            <Logo textColor="text-white" dotColor="text-primary" />
            <ul className="items-center justify-center hidden lg:flex">
              {navLinks.map((navItem) => (
                <NavButton key={navItem.text} href={navItem.href} text={navItem.text} active={navItem.active} />
              ))}
            </ul>
            <div className="flex items-center justify-end col-span-2 lg:col-span-1">
              {status !== "loading" && (
                <div className="hidden mr-6 lg:mr-0 lg:block">
                  {session ? (
                    <motion.div
                      className="relative"
                      onMouseEnter={toggleProfileHover}
                      onMouseLeave={toggleProfileHover}
                    >
                      <button type="button" className="w-full h-full">
                        <a className="flex items-center pl-4">
                          <Image
                            unoptimized
                            src={session.user?.image ? session.user.image : ""}
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
                          <Link href="/profile">
                            <a className="block w-full p-2 mb-1 text-left rounded-md hover:bg-zinc-800">Profile</a>
                          </Link>
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
                    <NavButton href="/api/auth/signin" text="Sign in" active={false} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
