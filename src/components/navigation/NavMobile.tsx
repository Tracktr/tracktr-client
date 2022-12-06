import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import ReactDOM from "react-dom";
import { navLinks } from "./Navbar";
import { motion } from "framer-motion";
import Logo from "../common/Logo";
import { IoMdClose } from "react-icons/io";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { BiChevronDown } from "react-icons/bi";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
              {session.status === "authenticated" ? (
                <>
                  <div onClick={() => setSubMenu(!submenu)} className="flex items-center w-full pl-4">
                    <Image
                      unoptimized
                      src={session.data?.user?.image ? session.data?.user?.image : ""}
                      width="36px"
                      height="36px"
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
                      submenu ? "h-36" : "h-0 overflow-hidden"
                    } transition-all duration-300 ease-in-out`}
                  >
                    {submenuItems.map((item: { href: string; text: string }) => (
                      <Link key={item.href} href={item.href}>
                        <a onClick={toggleNavMobile} className="block w-full p-2 mb-1 rounded-md hover:bg-zinc-800">
                          {item.text}
                        </a>
                      </Link>
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
