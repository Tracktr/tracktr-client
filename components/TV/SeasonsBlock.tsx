import { useState } from "react";
import Poster from "../common/poster/Poster";

interface ISeasons {
  seasons: any;
  seriesID: any;
}

const SeasonsBlock = ({ seasons, seriesID }: ISeasons) => {
  const [showSeasons, setShowSeasons] = useState(false);

  const toggleshowSeasons = () => {
    setShowSeasons(!showSeasons);
  };

  return (
    <div className="relative mb-24">
      <h2 className="pb-4 text-4xl font-bold">Seasons</h2>
      <div className={`grid grid-cols-5 gap-2 ${showSeasons ? "h-auto" : "h-64 overflow-hidden"}`}>
        {seasons
          .slice(0)
          .reverse()
          .map((item: any) => (
            <Poster
              type="series"
              key={item.id}
              imageSrc={item.poster_path}
              name={`Season ${item.season_number}`}
              url={`${seriesID}/season/${item.season_number}`}
            />
          ))}
      </div>
      {!showSeasons && seasons.length > 4 && (
        <button
          onClick={() => toggleshowSeasons()}
          type="button"
          className="absolute bottom-0 flex items-center justify-end w-full h-12 italic font-medium bg-gradient-to-t from-primaryBackground backdrop-grayscale"
        >
          <p className="px-4 py-2 mt-12 text-sm rounded-md bg-primary text-primaryBackground">Show all seasons...</p>
        </button>
      )}
    </div>
  );
};

export default SeasonsBlock;
