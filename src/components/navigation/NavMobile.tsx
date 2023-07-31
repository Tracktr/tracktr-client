import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import ReactDOM from "react-dom";
import { navLinks } from "./Navbar";
import { motion } from "framer-motion";
import Logo from "../common/Logo";
import { IoMdClose } from "react-icons/io";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { BiChevronDown } from "react-icons/bi";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ImageWithFallback from "../common/ImageWithFallback";

const NavMobile = ({
  toggleNavMobile,
  submenuItems,
}: {
  toggleNavMobile: () => void;
  submenuItems: {
    href: string;
    text: string;
  }[];
}) => {
  const queryClient = useQueryClient();
  const [submenu, setSubMenu] = useState(false);
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
              <Logo textColor="text-white" dotColor="text-primary" signedIn={session.status === "authenticated"} />
            </div>

            <button onClick={toggleNavMobile} className="pr-4 text-3xl text-primary">
              <IoMdClose />
            </button>
          </div>
          <hr className="border-white border-1 border-opacity-10" />

          <div className="flex flex-col w-full h-full">
            {navLinks
              .filter(
                (navItem) =>
                  session.status === "authenticated" || (session.status === "unauthenticated" && !navItem.userOnly)
              )
              .map((navItem) => (
                <li
                  className="text-white list-none group"
                  key={navItem.text}
                  onClick={toggleNavMobile}
                  onKeyDown={toggleNavMobile}
                  role="none"
                >
                  <Link href={navItem.href} className="block px-4 py-2 text-2xl group-hover:text-primary">
                    {navItem.text}
                  </Link>
                </li>
              ))}
            <div className="py-4 mt-auto text-white">
              {session.status === "authenticated" ? (
                <>
                  <div onClick={() => setSubMenu(!submenu)} className="flex items-center w-full pl-4" role="none">
                    <ImageWithFallback
                      unoptimized
                      src={session.data?.user?.image ? session.data?.user?.image : ""}
                      width={36}
                      height={36}
                      className="rounded-full"
                      alt="User profile image"
                    />
                    <p className="ml-2 text-sm">{session.data?.user?.name}</p>
                    <button className="ml-auto mr-4 text-2xl" onClick={() => setSubMenu(!submenu)}>
                      <BiChevronDown />
                    </button>
                  </div>
                  <div
                    className={`text-sm text-center ${
                      submenu ? "max-h-screen" : "max-h-0 overflow-hidden"
                    } transition-all duration-300 ease-in-out`}
                  >
                    {submenuItems.map((item: { href: string; text: string }) => (
                      <div key={item.href} onClick={toggleNavMobile} role="none">
                        <Link href={item.href} className="block w-full p-2 mb-1 rounded-md hover:bg-zinc-800">
                          {item.text}
                        </Link>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        queryClient.invalidateQueries();
                      }}
                      className="block w-full p-2 rounded-md hover:bg-zinc-800"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                session.status === "unauthenticated" && (
                  <li className="text-white list-none group">
                    <button
                      className="block px-4 py-2 text-2xl group-hover:text-primary"
                      onClick={() => {
                        toggleNavMobile();
                        signIn("google");
                      }}
                    >
                      Sign in
                    </button>
                  </li>
                )
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
