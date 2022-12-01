import Link from "next/link";
import ImageWithFallback from "../common/ImageWithFallback";

const ProfileHeader = ({ image, name, currentPage }: { image: string; name: string; currentPage?: string }) => (
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

    {currentPage && (
      <div className="flex gap-2 mx-5 my-10">
        <Button name="Settings" currentPage={currentPage} link="/profile/settings" />
        <Button name="History" currentPage={currentPage} link="/profile/history" />
        <Button name="Watchlist" currentPage={currentPage} link="/profile/watchlist" />
        <Button name="Followers" currentPage={currentPage} link="/profile/followers" />
      </div>
    )}
  </div>
);

const Button = ({ name, currentPage, link }: { currentPage: string; name: string; link: string }) => {
  return (
    <Link href={link}>
      <a
        className={`items-center px-3 py-1 text-xs text-center rounded-full ${
          name === currentPage ? "bg-primary text-primaryBackground" : "text-primary"
        }`}
      >
        {name}
      </a>
    </Link>
  );
};

export default ProfileHeader;
