import Link from "next/link";
import { AiFillStar } from "react-icons/ai";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import { IThemeColor } from "../watchButton/BaseWatchButton";
import GenresBlock from "./GenresBlock";

const ContentTitle = ({
  episode,
  theme_color,
  title,
  air_date,
  score,
  genres,
  gender,
}: {
  episode?: {
    base_url: string;
    season_number: number;
    episode_number: number;
  };
  theme_color: IThemeColor;
  title: string;
  air_date?: string;
  score?: number;
  genres?: {
    id: number;
    name: string;
  }[];
  gender?: number;
}) => {
  return (
    <div className="pt-6 text-3xl font-black md:text-6xl drop-shadow-lg">
      <div className="items-center justify-between md:flex">
        <h1 className="flex items-end max-w-2xl">
          {gender === 1 && <IoMdFemale className="mr-2 text-pink-500" />}
          {gender === 2 && <IoMdMale className="mr-2 text-blue-500" />}

          <div>
            {episode && (
              <div className="flex gap-2">
                <Link
                  href={`${episode.base_url}/season/${episode.season_number}`}
                  title="To season overview"
                  style={{
                    background: theme_color?.hex,
                  }}
                  className={`
                            inline-block px-3 py-1 text-xs rounded-full       
                            ${theme_color.isDark && "text-white"}
                            ${theme_color.isLight && "text-primaryBackground"}
                          `}
                >
                  Season {episode.season_number}
                </Link>
                <span
                  style={{
                    background: theme_color?.hex,
                  }}
                  className={`
                            inline-block px-3 py-1 text-xs rounded-full       
                            ${theme_color.isDark && "text-white"}
                            ${theme_color.isLight && "text-primaryBackground"}
                          `}
                >
                  Episode {episode.episode_number}
                </span>
              </div>
            )}
            {title}
            {air_date && (
              <span className="ml-4 text-xl opacity-75 md:text-4xl drop-shadow-md">{air_date.slice(0, 4)}</span>
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
      <GenresBlock genres={genres} themeColor={theme_color} />
    </div>
  );
};

export default ContentTitle;
