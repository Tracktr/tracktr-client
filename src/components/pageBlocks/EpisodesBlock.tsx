import { useRouter } from "next/router";
import EpisodePoster from "../posters/EpisodePoster";

interface IEpisodesBlock {
  episodes: any;
  markAsWatched: any;
}

const EpisodesBlock = ({ episodes, markAsWatched }: IEpisodesBlock) => {
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
          markAsWatched={markAsWatched}
          watched={item.watched}
        />
      ))}
    </div>
  );
};

export default EpisodesBlock;
