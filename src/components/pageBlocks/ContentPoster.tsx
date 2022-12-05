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
  showReviewButton,
  title,
  poster,
  id,
  theme_color,
  progression,
  episode,
}: {
  hideWatchButton?: boolean;
  showWatchlistButton?: boolean;
  showReviewButton?: boolean;
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

        {session.status === "authenticated" && (
          <>
            {progression && (
              <div className="pt-4 pb-4 md:row-start-auto">
                <SeriesProgressionBlock
                  amountOfEpisodes={progression.number_of_episodes}
                  numberOfEpisodesWatched={progression.number_of_episodes_watched}
                  themeColor={theme_color}
                />
              </div>
            )}
            {!hideWatchButton &&
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
            {(showWatchlistButton || showReviewButton) && (
              <div className="grid grid-cols-4">
                {showWatchlistButton && (
                  <WatchlistButton
                    themeColor={theme_color}
                    movieID={!progression ? id : undefined}
                    seriesID={progression ? id : undefined}
                  />
                )}
                {showReviewButton && (
                  <ReviewButton
                    themeColor={theme_color}
                    movieID={!progression ? id : undefined}
                    seriesID={progression ? id : undefined}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContentPoster;
