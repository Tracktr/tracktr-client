import ImageWithFallback from "../common/ImageWithFallback";

const ProfileHeader = ({ image, name }: { image: string; name: string }) => (
  <div className="max-w-6xl pt-24 m-auto">
    <div className="flex items-center">
      <ImageWithFallback
        src={image}
        fallbackSrc="/placeholder_profile.png"
        width="128"
        height="128"
        alt="Profile picture"
        className="rounded-full"
      />
      <p className="ml-6 text-4xl font-bold">{name}</p>
    </div>
  </div>
);

export default ProfileHeader;
