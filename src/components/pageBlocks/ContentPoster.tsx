import { useScroll, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PosterImage } from "../../utils/generateImages";
import ReviewButton from "../common/ReviewButton";
import WatchlistButton from "../common/WatchlistButton";
import { IThemeColor } from "../watchButton/BaseWatchButton";
import EpisodeWatchButton from "../watchButton/EpisodeWatchButton";
import MovieWatchButton from "../watchButton/MovieWatchButton";
import SeriesProgressionBlock from "./SeriesProgressionBlock";

const ContentPoster = ({
  hideWatchButton,
  showWatchlistButton,
  title,
  poster,
  id,
  theme_color,
  progression,
  episode,
}: {
  hideWatchButton?: boolean;
  showWatchlistButton?: boolean;
  title: string;
  poster: string;
  id: number;
  theme_color: IThemeColor;
  progression?: {
    number_of_episodes: number;
    number_of_episodes_watched: { count: number }[];
  };
  episode?: {
    seasonID: number;
    episodeID: number;
    refetch: () => void;
  };
}) => {
  const session = useSession();
  const [scrollPosition, setScrollPosition] = useState(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrollPosition(latest);
    });
  }, [scrollY]);

  return (
    <div className="col-span-1 mx-4 text-center">
      <div className="sticky inline-block top-16 max-w-[216px] w-full ">
        <motion.div
          animate={{
            overflow: "hidden",
            width: scrollPosition > 300 ? "150px" : "auto",
            height: "auto",
            transition: {
              bounce: 0,
            },
          }}
          className="m-auto border-4 rounded-md border-primaryBackground"
        >
          <Image
            alt={"Poster image for:" + title}
            width="208"
            height="311"
            src={PosterImage({ path: poster, size: "lg" })}
          />
        </motion.div>

        {progression && session.status === "authenticated" && (
          <div className="pt-4 pb-4 md:row-start-auto">
            <SeriesProgressionBlock
              amountOfEpisodes={progression.number_of_episodes}
              numberOfEpisodesWatched={progression.number_of_episodes_watched}
              themeColor={theme_color}
            />
          </div>
        )}
        {!hideWatchButton &&
          session.status === "authenticated" &&
          (episode ? (
            <EpisodeWatchButton
              itemID={id}
              episodeID={episode.episodeID}
              seasonID={episode.seasonID}
              themeColor={theme_color}
              refetchProgression={episode.refetch}
            />
          ) : (
            <MovieWatchButton itemID={id} themeColor={theme_color} />
          ))}
        {session.status === "authenticated" && (
          <div className="grid grid-cols-4">
            {showWatchlistButton && session.status === "authenticated" && (
              <WatchlistButton themeColor={theme_color} movieID={id} />
            )}
            <ReviewButton themeColor={theme_color} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPoster;
