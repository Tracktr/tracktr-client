import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import NavButton from "./Navbutton";

const NavProfile = () => {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <div className="relative">
          <Link href="/profile">
            <a className="flex items-center text-white transition duration-150 ease-in-out border-collapse cursor-pointer rounded-t-md">
              <Image
                unoptimized
                src={session.user?.image ? session.user.image : ""}
                width="36px"
                height="36px"
                className="rounded-full"
              />
              <p className="w-24 ml-2 text-sm truncate">{session.user?.name}</p>
            </a>
          </Link>
        </div>
      ) : (
        <NavButton href="/signin" text="Sign in" active={false} />
      )}
    </div>
  );
};

export default NavProfile;
