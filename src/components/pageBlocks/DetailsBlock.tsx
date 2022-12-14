interface DetailsBlockProps {
  releaseDate?: string;
  runtime?: number;
  status?: string;
  budget?: number;
  revenue?: number;
  numberOfEpisodes?: number;
  numberOfSeasons?: number;
}

const DetailsBlock = ({
  releaseDate,
  runtime,
  status,
  budget,
  revenue,
  numberOfEpisodes,
  numberOfSeasons,
}: DetailsBlockProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 pt-8 mb-12 md:grid-cols-3">
      {releaseDate && (
        <div className="flex flex-col">
          <h2 className="text-base font-bold opacity-75">Release Date</h2>
          <p className="pt-2">
            {new Date(releaseDate).toLocaleDateString("en-UK", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}
      {runtime && (
        <div className="flex flex-col">
          <h2 className="text-base font-bold opacity-75">Runtime</h2>
          <p className="pt-2">{runtime} minutes</p>
        </div>
      )}

      {status && (
        <div className="flex flex-col">
          <h2 className="text-base font-bold opacity-75">Status</h2>
          <p className="pt-2">{status}</p>
        </div>
      )}
      {budget !== undefined && (
        <div className="flex flex-col">
          <h2 className="text-base font-bold opacity-75">Budget</h2>
          {budget >= 1 ? <p className="pt-2">${budget.toLocaleString()}</p> : <p className="pt-2">Unknown</p>}
        </div>
      )}
      {revenue !== undefined && (
        <div className="flex flex-col">
          <h2 className="text-base font-bold opacity-75">Revenue</h2>
          {revenue > 0 ? <p className="pt-2">${revenue.toLocaleString()}</p> : <p className="pt-2">Unknown</p>}
        </div>
      )}
      {numberOfEpisodes && numberOfEpisodes !== 0 && (
        <div className="flex flex-col">
          <h2 className="text-base font-bold opacity-75">Episodes</h2>
          <p className="pt-2">{numberOfEpisodes}</p>
        </div>
      )}
      {numberOfSeasons && numberOfSeasons !== 0 && (
        <div className="flex flex-col">
          <h2 className="text-base font-bold opacity-75">Seasons</h2>
          <p className="pt-2">{numberOfSeasons}</p>
        </div>
      )}
    </div>
  );
};

export default DetailsBlock;
