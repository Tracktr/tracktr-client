import Image from "next/image";
import { signOut } from "next-auth/react";

const ProfileHeader = ({ image, name }: any) => (
  <div className="max-w-6xl pt-24 m-auto">
    <div className="flex items-center">
      <Image src={image} width="128" height="128" className="rounded-full bg-primary" />
      <p className="ml-6 text-4xl font-bold">
        {name}
        <span className="block mt-2 text-sm font-normal">
          <button onClick={() => signOut()}>Logout</button>
        </span>
      </p>
    </div>
  </div>
);

export default ProfileHeader;
