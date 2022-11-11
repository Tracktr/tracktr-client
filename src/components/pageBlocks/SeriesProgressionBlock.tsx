interface SeriesProgressionBlockProps {
  numberOfEpisodesWatched: any;
  amountOfEpisodes: any;
}

const SeriesProgressionBlock = ({ numberOfEpisodesWatched, amountOfEpisodes }: SeriesProgressionBlockProps) => {
  const { count } = numberOfEpisodesWatched[0];
  const currentPercentage = (Number(count) / Number(amountOfEpisodes)) * 100;
  return (
    <div>
      <div className="flex justify-between pb-1 text-sm uppercase opacity-50">
        <p>{currentPercentage}% Watched</p>
        <p>
          {Number(count)}/{amountOfEpisodes} episodes
        </p>
      </div>

      <div className="flex w-full bg-black rounded-full">
        <span className="h-2 rounded-full bg-primary" style={{ width: `${currentPercentage}%` }} />
      </div>
    </div>
  );
};

export default SeriesProgressionBlock;
