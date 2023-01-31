import Image from "next/image";
import Link from "next/link";
import { PosterImage } from "../../utils/generateImages";
import ImageWithFallback from "./ImageWithFallback";

interface IFriendReview {
  content: string;
  created: Date;
  item: {
    id: number;
    name?: string;
    title?: string;
    poster: string;
  };
  friend: {
    image: string;
    name: string;
  };
}

const FriendReview = ({ content, created, item, friend }: IFriendReview) => {
  return (
    <div className="flex items-center w-full gap-2 mb-4">
      <Link href={`/${item.name ? "tv" : "movies"}/${item.id}#reviews`}>
        <a>
          <Image
            alt={"Poster image for:" + item.name || item.title}
            width="100"
            height="150"
            src={PosterImage({ path: item.poster, size: "lg" })}
          />
        </a>
      </Link>
      <div className="w-[75%]">
        <Link href={`/profile/${friend.name}`}>
          <a className="flex items-center gap-2">
            <ImageWithFallback
              src={friend.image}
              fallbackSrc="/placeholder_profile.png"
              width="16"
              height="16"
              alt="Profile picture"
              className="rounded-full"
            />
            <p className="text-sm">{friend.name}</p>
          </a>
        </Link>
        <p className="text-xl">{item.name || item.title}</p>
        <div className="mb-4 text-sm">
          {created.toLocaleString("en-UK", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
};

export const LoadingFriendReview = () => (
  <div className="flex items-center w-full gap-2 mb-4">
    <div className="flex items-center w-full gap-2 mb-4">
      <div className="w-[100px] h-[150px] animate-pulse bg-[#343434]" />
      <div className="w-[75%]">
        <div className="flex items-center gap-2 mb-1">
          <div className="animate-pulse w-[16px] h-[16px] rounded-full bg-[#343434]" />
          <div className="animate-pulse w-[50%] h-[20px] rounded bg-[#343434]" />
        </div>
        <div className="h-[28px] w-full animate-pulse rounded bg-[#343434] mb-1" />
        <div className="mb-4 h-[20px] w-[50%] animate-pulse rounded bg-[#343434]" />
        <div className="h-[48px] w-[100%] animate-pulse rounded bg-[#343434]" />
      </div>
    </div>
  </div>
);

export default FriendReview;