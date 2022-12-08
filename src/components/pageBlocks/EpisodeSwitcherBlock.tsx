import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

interface IPrevNextSeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

const EpisodeSwitcherBlock = ({ seasons }: EpisodeSwitcherBlockProps) => {
  const router = useRouter();
  const { series: seriesID, season: seasonNumber, episode: episodeNumber } = router.query;
  const [previousSeason, setPreviousSeason] = useState<false | IPrevNextSeason>();
  const [nextSeason, setNextSeason] = useState<false | IPrevNextSeason>();

  useEffect(() => {
    if (router.isReady) {
      const currentSeason = seasons.filter((season: any) => season.season_number == Number(seasonNumber))[0];

      setPreviousSeason(
        Number(episodeNumber) <= 1 &&
          seasons.filter((season: any) => season.season_number == Number(seasonNumber) - 1)[0]
      );
      setNextSeason(
        currentSeason?.episode_count === Number(episodeNumber) &&
          seasons.filter((season: any) => season.season_number == Number(seasonNumber) + 1)[0]
      );
    }
  }, [router.isReady, episodeNumber, seasonNumber, seasons]);

  const hasPreviousEpisode = () => {
    return Number(episodeNumber) > 1 || previousSeason;
  };

  const hasNextEpisode = () => {
    const currentSeason = seasons.filter((season: any) => season.season_number == Number(seasonNumber))[0];

    if (Number(currentSeason?.episode_count) > Number(episodeNumber)) {
      console.log("episode count > episode number");
      return true;
    } else if (nextSeason) {
      return true;
    }
  };

  const previousEpisodePath = () => {
    if (previousSeason) {
      return `/tv/${seriesID}/season/${previousSeason.season_number}/episode/${Number(previousSeason.episode_count)}`;
    }
    return `/tv/${seriesID}/season/${seasonNumber}/episode/${Number(episodeNumber) - 1}`;
  };

  const nextEpisodePath = () => {
    if (nextSeason) {
      return `/tv/${seriesID}/season/${nextSeason.season_number}/episode/1`;
    }

    return `/tv/${seriesID}/season/${seasonNumber}/episode/${Number(episodeNumber) + 1}`;
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
