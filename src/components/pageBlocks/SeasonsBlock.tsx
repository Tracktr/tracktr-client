import { useRouter } from "next/router";
import HorizontalScrollContainer from "../common/HorizontalScrollContainer";
import TVPoster from "../posters/TVPoster";

interface ISeasons {
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
  }[];
}

const SeasonsBlock = ({ seasons }: ISeasons) => {
  const router = useRouter();
  const { tvID } = router.query;

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
                <TVPoster
                  imageSrc={item.poster_path}
                  name={`Season ${item.season_number}`}
                  url={`${tvID}/season/${item.season_number}`}
                />
              </div>
            ))}
        </HorizontalScrollContainer>
      </div>
    </div>
  );
};

export default SeasonsBlock;
