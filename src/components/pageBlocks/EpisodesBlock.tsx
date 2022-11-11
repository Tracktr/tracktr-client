import { useRouter } from "next/router";
import EpisodePoster from "../posters/EpisodePoster";

interface IEpisodesBlock {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  episodes: any;
}

const EpisodesBlock = ({ episodes }: IEpisodesBlock) => {
  const router = useRouter();
  const { tvID } = router.query;

  return (
    <div className="space-y-4 mb-14">
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        episodes.map((item: any) => (
          <EpisodePoster
            key={item.id}
            imageSrc={item.still_path}
            name={item.name}
            overview={item.overview}
            season={item.season_number}
            episode={item.episode_number}
            url={`/tv/${tvID}/season/${item.season_number}/episode/${item.episode_number}`}
            score={item.vote_average}
          />
        ))
      }
    </div>
  );
};

export default EpisodesBlock;
