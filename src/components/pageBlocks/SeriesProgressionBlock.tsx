import { IThemeColor } from "../watchButton/BaseWatchButton";

interface SeriesProgressionBlockProps {
  numberOfEpisodesWatched: { count: number }[];
  amountOfEpisodes: number;
  themeColor?: IThemeColor;
}

const SeriesProgressionBlock = ({
  numberOfEpisodesWatched,
  amountOfEpisodes,
  themeColor,
}: SeriesProgressionBlockProps) => {
  const count = numberOfEpisodesWatched[0]?.count;
  const currentPercentage = Math.ceil((Number(count) / Number(amountOfEpisodes)) * 100);
  return (
    <div>
      <div className="flex justify-between pb-1 text-xs uppercase opacity-50">
        <p>{currentPercentage}% Watched</p>
        <p>
          {Number(count)}/{amountOfEpisodes} episodes
        </p>
      </div>

      <div className="flex w-full bg-black rounded-full">
        <span
          className="h-2 transition-all duration-300 ease-in-out rounded-full bg-primary"
          style={{ width: `${currentPercentage}%`, background: themeColor?.hex }}
        />
      </div>
    </div>
  );
};

export default SeriesProgressionBlock;
