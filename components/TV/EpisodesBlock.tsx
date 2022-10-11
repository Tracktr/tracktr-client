import Still from "../common/Still/Still";

interface IEpisodesBlock {
  episodes: any;
}

const EpisodesBlock = ({ episodes }: IEpisodesBlock) => (
  <div className="space-y-4">
    {episodes.map((item: any) => (
      <Still
        key={item.id}
        imageSrc={item.still_path}
        name={item.name}
        overview={item.overview}
        season={item.season_number}
        episode={item.episode_number}
      />
    ))}
  </div>
);

export default EpisodesBlock;
