import { useRouter } from "next/router";
import HorizontalScrollContainer from "../common/HorizontalScrollContainer";
import SeasonPoster from "../posters/SeasonPoster";

interface ISeasons {
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    watched: boolean;
  }[];
  refetch: () => void;
  isRefetching: boolean;
}

const SeasonsBlock = ({ seasons, refetch, isRefetching }: ISeasons) => {
  const router = useRouter();
  const { series: seriesID } = router.query;

  return (
    <div className="relative mb-24">
      <h2 className="pb-4 text-4xl font-bold">Seasons</h2>
      <div>
        <HorizontalScrollContainer>
          {seasons
            .slice(0)
            .reverse()
            .map((item) => (
              <div key={item.id} className="flex-shrink-0">
                <SeasonPoster
                  id={item.id}
                  seasonNumber={item.season_number}
                  seriesID={Number(seriesID)}
                  imageSrc={item.poster_path}
                  name={`Season ${item.season_number}`}
                  url={`${seriesID}/season/${item.season_number}`}
                  watched={item.watched}
                  refetch={refetch}
                  fetchStatus={isRefetching}
                />
              </div>
            ))}
        </HorizontalScrollContainer>
      </div>
    </div>
  );
};

export default SeasonsBlock;
