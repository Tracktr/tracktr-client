import Image from "next/image";

const ProfileHeader = ({ image, name }: any) => (
  <div className="flex items-center max-w-6xl pt-24 m-auto">
    <Image src={image} width="128" height="128" className="rounded-full bg-primary" />
    <p className="ml-6 text-4xl font-bold">{name}</p>
  </div>
);

export default ProfileHeader;
