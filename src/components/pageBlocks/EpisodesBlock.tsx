import { useRouter } from "next/router";
import EpisodePoster from "../posters/EpisodePoster";
import { IThemeColor } from "../watchButton/BaseWatchButton";

const EpisodesBlock = ({ episodes, refetch, fetchStatus, themeColor }: IEpisodesBlock) => {
  const router = useRouter();
  const { series: seriesID } = router.query;

  return (
    <div className="space-y-4 mb-14">
      {episodes.map((item) => (
        <EpisodePoster
          key={item.id}
          id={item.id}
          imageSrc={item.still_path}
          name={item.name}
          overview={item.overview}
          season={item.season_number}
          episode={item.episode_number}
          url={`/tv/${seriesID}/season/${item.season_number}/episode/${item.episode_number}`}
          score={item.vote_average}
          series_id={item.show_id}
          watched={item.watched}
          watched_id={item.watched_id}
          refetch={refetch}
          fetchStatus={fetchStatus}
          themeColor={themeColor}
        />
      ))}
    </div>
  );
};

interface IEpisodesBlock {
  episodes: IEpisode[];
  refetch: () => void;
  fetchStatus: boolean;
  themeColor: IThemeColor;
}

interface Crew {
  job: string;
  department: string;
  credit_id: string;
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
}

interface GuestStar {
  character: string;
  credit_id: string;
  order: number;
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
}

interface IEpisode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
  crew: Crew[];
  guest_stars: GuestStar[];
  watched: boolean;
  watched_id: string;
}

export default EpisodesBlock;
