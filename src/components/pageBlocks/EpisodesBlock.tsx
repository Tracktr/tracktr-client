import { useRouter } from "next/router";
import EpisodePoster from "../posters/EpisodePoster";

interface IEpisodesBlock {
  episodes: any;
  refetch: () => void;
}

const EpisodesBlock = ({ episodes, refetch }: IEpisodesBlock) => {
  const router = useRouter();
  const { tvID } = router.query;

  return (
    <div className="space-y-4 mb-14">
      {episodes.map((item: any) => (
        <EpisodePoster
          key={item.id}
          imageSrc={item.still_path}
          name={item.name}
          overview={item.overview}
          season={item.season_number}
          episode={item.episode_number}
          url={`/tv/${tvID}/season/${item.season_number}/episode/${item.episode_number}`}
          score={item.vote_average}
          series_id={item.show_id}
          watched={item.watched}
          watched_id={item.watched_id}
          refetch={refetch}
        />
      ))}
    </div>
  );
};

export default EpisodesBlock;
