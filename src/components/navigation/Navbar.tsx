import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CgMenuGridO, CgClose } from "react-icons/cg";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Logo from "../common/Logo";
import NavButton from "./Navbutton";

const navLinks = [
  { href: "/movies", text: "Movies", active: false },
  { href: "/tv", text: " Series", active: false },
];

const Navbar = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const { pathname, asPath } = useRouter();

  useEffect(() => {
    setOpen(false);
  }, [asPath]);

  if (pathname !== "/auth/signin") {
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
                <div className="hidden mr-6 lg:mr-0 lg:block">
                  {session ? (
                    <Link href="/profile" type="button" className="w-full h-full">
                      <a className="flex items-center pl-4">
                        <Image
                          unoptimized
                          src={session.user?.image ? session.user.image : ""}
                          width="36px"
                          height="36px"
                          className="rounded-full"
                        />
                        <p className="ml-2 text-sm">{session.user?.name}</p>
                      </a>
                    </Link>
                  ) : (
                    <NavButton href="/api/auth/signin" text="Sign in" active={false} />
                  )}
                </div>
                <button type="button" className="block cursor-pointer lg:hidden" onClick={() => setOpen(!open)}>
                  {open ? <CgClose className="text-2xl" /> : <CgMenuGridO className="text-2xl" />}
                </button>
              </div>
            </div>
          </div>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed top-0 left-0 z-50 w-full h-screen overflow-hidden bg-opacity-95 backdrop-blur-md bg-primaryBackground"
              initial={{ width: 0 }}
              animate={{
                width: 300,
                opacity: 1,
              }}
              exit={{
                width: 0,
                opacity: 0,
                transition: { duration: 0.3 },
              }}
            >
              <div className="flex flex-col w-full h-full text-center align-middle">
                <div className="pt-2 pb-3">
                  <Logo textColor="text-white" dotColor="text-primary" />
                </div>
                <hr className="border-white border-1 border-opacity-10" />

                <div className="flex flex-col w-full h-full">
                  {navLinks.map((navItem) => (
                    <li key={navItem.href} className="text-white list-none group">
                      <Link href={navItem.href}>
                        <a
                          className={`group-hover:text-primary text-2xl px-4 py-2 block ${
                            navItem.active ? "font-bold" : ""
                          }`}
                        >
                          {navItem.text}
                        </a>
                      </Link>
                    </li>
                  ))}
                  <div className="py-4 mt-auto">
                    {session ? (
                      <Link href="/profile/" type="button" className="w-full h-full">
                        <a className="flex items-center pl-4">
                          <Image
                            unoptimized
                            src={session.user?.image ? session.user.image : ""}
                            width="36px"
                            height="36px"
                            className="rounded-full"
                          />
                          <p className="ml-2 text-sm">{session.user?.name}</p>
                        </a>
                      </Link>
                    ) : (
                      <NavButton href="/api/auth/signin" text="Sign in" active={false} />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return <div />;
};

export default Navbar;
