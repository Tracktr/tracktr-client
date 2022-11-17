import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import ReactDOM from "react-dom";
import { navLinks } from "./Navbar";
import { motion } from "framer-motion";
import Logo from "../common/Logo";
import { IoMdClose } from "react-icons/io";
import { useSession } from "next-auth/react";
import Image from "next/image";

const NavMobile = ({ toggleNavMobile }: any) => {
  const session = useSession();

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 z-50 w-full h-screen overflow-hidden bg-opacity-95 backdrop-blur-md bg-primaryBackground"
        initial={{ left: "-75%" }}
        animate={{
          left: 0,
          opacity: 1,
        }}
        exit={{
          opacity: 0,
          transition: { duration: 0.3 },
        }}
      >
        <div className="flex flex-col w-full h-full text-center align-middle">
          <div className="flex items-center justify-between pt-2 pb-2">
            <div className="pl-4">
              <Logo textColor="text-white" dotColor="text-primary" />
            </div>

            <button onClick={toggleNavMobile} className="pr-4 text-3xl text-primary">
              <IoMdClose />
            </button>
          </div>
          <hr className="border-white border-1 border-opacity-10" />

          <div className="flex flex-col w-full h-full">
            {navLinks.map((navItem) => (
              <li className="text-white list-none group" key={navItem.text}>
                <Link href={navItem.href}>
                  <a onClick={toggleNavMobile} className="block px-4 py-2 text-2xl group-hover:text-primary">
                    {navItem.text}
                  </a>
                </Link>
              </li>
            ))}
            <div className="py-4 mt-auto text-white">
              {session ? (
                <Link href="/profile/" type="button" className="w-full h-full">
                  <a onClick={toggleNavMobile} className="flex items-center pl-4">
                    <Image
                      unoptimized
                      src={session.data?.user?.image ? session.data?.user?.image : ""}
                      width="36px"
                      height="36px"
                      className="rounded-full"
                      alt="User profile image"
                    />
                    <p className="ml-2 text-sm">{session.data?.user?.name}</p>
                  </a>
                </Link>
              ) : (
                <li className="text-white list-none group">
                  <Link href="/api/auth/signin">
                    <a onClick={toggleNavMobile} className="block px-4 py-2 text-2xl group-hover:text-primary">
                      Sign in
                    </a>
                  </Link>
                </li>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default NavMobile;
