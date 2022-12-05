import { AiFillStar } from "react-icons/ai";
import { IThemeColor } from "../watchButton/BaseWatchButton";
import GenresBlock from "./GenresBlock";

const ContentTitle = ({
  episode,
  theme_color,
  title,
  air_date,
  score,
  genres,
}: {
  episode?: {
    season_number: number;
    episode_number: number;
  };
  theme_color: IThemeColor;
  title: string;
  air_date?: string;
  score: number;
  genres?: {
    id: number;
    name: string;
  }[];
}) => {
  return (
    <div className="pt-6 text-3xl font-black md:text-6xl drop-shadow-lg">
      <div className="items-center justify-between md:flex">
        <h1 className="flex items-end max-w-2xl">
          <div>
            {episode && (
              <div className="flex">
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
                  {episode.season_number}x{episode.episode_number}
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
