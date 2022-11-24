import Link from "next/link";
import { useRouter } from "next/router";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";

interface EpisodeSwitcherBlockProps {
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

const EpisodeSwitcherBlock = ({ seasons }: EpisodeSwitcherBlockProps) => {
  const router = useRouter();
  const { tvID, seasonID, episodeID } = router.query;

  const hasPreviousEpisode = () => {
    return Number(episodeID) > 1 ? true : false;
  };

  const hasNextEpisode = () => {
    return seasons[`${Number(seasonID) > 0 ? Number(seasonID) - 1 : Number(seasonID)}`]?.episode_count ||
      0 <= Number(episodeID)
      ? false
      : true;
  };

  const previousEpisodePath = () => {
    const previousEpisode = parseInt(episodeID as string) - 1;
    return `/tv/${tvID}/season/${seasonID}/episode/${previousEpisode}`;
  };

  const nextEpisodePath = () => {
    const nextEpisode = parseInt(episodeID as string) + 1;
    return `/tv/${tvID}/season/${seasonID}/episode/${nextEpisode}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        {hasPreviousEpisode() ? (
          <Link href={`${previousEpisodePath()}`}>
            <a className="block py-6 transition-all duration-300 ease-in-out opacity-25 group hover:opacity-100">
              <IoIosArrowRoundBack className="ml-6 text-6xl transition-all duration-300 ease-in-out group-hover:ml-0" />
              <span>Previous Episode</span>
            </a>
          </Link>
        ) : (
          <div></div>
        )}

        {hasNextEpisode() ? (
          <Link href={`${nextEpisodePath()}`}>
            <a className="block py-6 transition-all duration-300 ease-in-out opacity-25 group hover:opacity-100">
              <IoIosArrowRoundForward className="ml-auto mr-6 text-6xl transition-all duration-300 ease-in-out group-hover:mr-0" />
              <span className="block text-right">Next Episode</span>
            </a>
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default EpisodeSwitcherBlock;
