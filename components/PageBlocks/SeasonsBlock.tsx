import HorizontalScrollContainer from "../common/HorizontalScrollContainer";
import TVPoster from "../common/poster/TVPoster";

interface ISeasons {
  seasons: any;
  seriesID: any;
}

const SeasonsBlock = ({ seasons, seriesID }: ISeasons) => (
  <div className="relative mb-24">
    <h2 className="pb-4 text-4xl font-bold">Seasons</h2>
    <div>
      <HorizontalScrollContainer>
        {seasons
          .slice(0)
          .reverse()
          .map((item: any) => (
            <div className="flex-shrink-0">
              <TVPoster
                key={item.id}
                imageSrc={item.poster_path}
                name={`Season ${item.season_number}`}
                url={`${seriesID}/season/${item.season_number}`}
              />
            </div>
          ))}
      </HorizontalScrollContainer>
    </div>
  </div>
);

export default SeasonsBlock;
