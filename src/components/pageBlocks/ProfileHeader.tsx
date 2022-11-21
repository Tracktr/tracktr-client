import Image from "next/image";

const ProfileHeader = ({ image, name }: any) => (
  <div className="max-w-6xl pt-24 m-auto">
    <div className="flex items-center">
      <Image src={image} width="128" height="128" alt="Profile picture" className="rounded-full bg-primary" />
      <p className="ml-6 text-4xl font-bold">{name}</p>
    </div>
  </div>
);

export default ProfileHeader;
