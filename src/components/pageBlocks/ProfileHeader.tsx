import Link from "next/link";
import ImageWithFallback from "../common/ImageWithFallback";

const ProfileHeader = ({ image, name, currentPage }: { image: string; name: string; currentPage?: string }) => (
  <div className="max-w-6xl pt-24 m-auto">
    <Link href={`/profile/${name}`} className="flex items-center">
      <ImageWithFallback
        src={image}
        fallbackSrc="/placeholder_profile.png"
        width={128}
        height={128}
        alt="Profile picture"
        className="rounded-full w-[64px] md:w-[128px] h-[74px] md:h-[128px]"
      />
      <p className="ml-6 overflow-hidden text-3xl font-bold break-words md:text-4xl">{name}</p>
    </Link>

    {currentPage && (
      <div className="flex flex-wrap gap-2 mx-5 my-10">
        <Button name="Settings" currentPage={currentPage} link="/profile/settings" />
        <Button name="History" currentPage={currentPage} link="/profile/history" />
        <Button name="Progress" currentPage={currentPage} link="/profile/progress" />
        <Button name="Watchlist" currentPage={currentPage} link="/profile/watchlist" />
        <Button name="Social" currentPage={currentPage} link="/profile/social" />
      </div>
    )}
  </div>
);

const Button = ({ name, currentPage, link }: { currentPage: string; name: string; link: string }) => {
  return (
    <Link
      href={link}
      className={`items-center px-3 py-1 text-xs text-center rounded-full ${
        name === currentPage ? "bg-primary text-primaryBackground" : "text-primary"
      }`}
    >
      {name}
    </Link>
  );
};

export default ProfileHeader;
