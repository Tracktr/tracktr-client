import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import NavButton from "./NavButton";

const NavProfileMobile = ({ className }: any) => {
  const { data: session } = useSession();

  return (
    <div className={`${className} py-4`}>
      {session ? (
        <button onClick={() => signOut()} type="button" className="w-full h-full">
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
        </button>
      ) : (
        <NavButton href="/api/auth/signin" text="Sign in" active={false} />
      )}
    </div>
  );
};

export default NavProfileMobile;
