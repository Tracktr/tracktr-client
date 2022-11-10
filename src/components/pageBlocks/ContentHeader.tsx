import { useSession } from "next-auth/react";
import Image from "next/image";
import { BackdropImage, PosterImage } from "../../utils/generateImages";
import WatchedButton from "../common/WatchedButton";
import GenresBlock from "./GenresBlock";
import { AiFillStar } from "react-icons/ai";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import JustWatchButton from "../common/JustWatch";

interface IContentHeader {
  idForWatchButton?: number;
  cover?: string;
  poster: string;
  genres?: string[];
  title: string;
  date?: string;
  description: string;
  score?: number;
  gender?: number;
  justWatch?: any;
  children?: any;
}

const ContentHeader = ({
  idForWatchButton,
  cover,
  poster,
  title,
  date,
  description,
  children,
  genres,
  score,
  gender,
  justWatch,
}: IContentHeader) => {
  const session = useSession();

  return (
    <>
      <div
        className="absolute w-screen max-w-full h-64 md:h-[32rem] top-0 left-0"
        style={{
          background: cover && `url("${BackdropImage({ path: cover, size: "lg" })}") no-repeat`,
          backgroundSize: "cover",
        }}
      >
        <div className="relative w-full h-full bg-gradient-to-t from-primaryBackground" />
      </div>

      <div className="relative w-full">
        <div className="grid max-w-6xl grid-cols-1 pt-24 m-auto md:grid-cols-4 md:pt-96">
          <div className="col-span-1 mx-4 text-center">
            <div className="relative inline-block border-4 rounded-md border-primaryBackground">
              <Image
                alt={"Poster image for:" + title}
                width="208"
                height="311"
                src={PosterImage({ path: poster, size: "lg" })}
              />
              {justWatch && <JustWatchButton justWatch={justWatch} />}
            </div>
          </div>

          <div className="col-span-3 px-4">
            <div className="pt-6 text-3xl font-black md:text-6xl drop-shadow-lg">
              <div className="items-center justify-between md:flex">
                <h1 className="flex items-end max-w-2xl">
                  {gender === 1 && <IoMdFemale className="mr-2 text-pink-500" />}
                  {gender === 2 && <IoMdMale className="mr-2 text-blue-500" />}

                  <div>
                    {title}
                    {date && (
                      <span className="ml-4 text-xl opacity-75 md:text-4xl drop-shadow-md">{date.slice(0, 4)}</span>
                    )}
                  </div>
                </h1>
                {score !== undefined && (
                  <span className="flex items-center p-2 text-xl">
                    <AiFillStar className="mr-2 text-primary" size={24} />
                    {score > 0 ? score.toPrecision(2) + " / 10" : "N/A"}
                  </span>
                )}
              </div>

              <GenresBlock genres={genres} />
            </div>
            <div className="grid-cols-5 lg:grid">
              <p className="max-w-full col-span-3 pt-8 lg:pb-12">{description}</p>
              {idForWatchButton && session.status === "authenticated" ? (
                <div className="col-span-2 pt-4 pb-4 lg:ml-6 md:row-start-auto">
                  <WatchedButton movieID={idForWatchButton} />
                </div>
              ) : (
                ""
              )}
            </div>

            {children || ""}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentHeader;
