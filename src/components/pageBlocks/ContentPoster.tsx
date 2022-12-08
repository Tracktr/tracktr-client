import { useScroll, motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import ConditionalLink from "../../utils/ConditionalLink";
import { PosterImage } from "../../utils/generateImages";
import ReviewButton from "../common/ReviewButton";
import WatchlistButton from "../common/WatchlistButton";
import { IThemeColor } from "../watchButton/BaseWatchButton";
import EpisodeWatchButton from "../watchButton/EpisodeWatchButton";
import MovieWatchButton from "../watchButton/MovieWatchButton";
import SeasonWatchButton from "../watchButton/SeasonWatchButton";
import SeriesWatchButton from "../watchButton/SeriesWatchButton";
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
  refetchReviews,
  season,
  series,
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
    seasonNumber: number;
    episodeNumber: number;
    episodeID: number;
    refetch: () => void;
  };
  season?: {
    watchHistory: any;
    seasonID: number;
    seasonNumber: number;
    refetch: () => void;
  };
  series?: {
    watchHistory: any;
    refetch: () => void;
  };
  refetchReviews?: () => void;
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
          <ConditionalLink href={`/tv/${id}`} condition={episode || season}>
            <Image
              alt={"Poster image for:" + title}
              width="208"
              height="311"
              src={PosterImage({ path: poster, size: "lg" })}
            />
          </ConditionalLink>
        </motion.div>

        {session.status === "authenticated" ? (
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
                  episode={episode}
                  themeColor={theme_color}
                  refetchProgression={episode.refetch}
                />
              ) : season ? (
                <SeasonWatchButton
                  itemID={id}
                  seasonNumber={season.seasonNumber}
                  seasonID={season.seasonID}
                  themeColor={theme_color}
                  watchHistory={season.watchHistory}
                  refetchProgression={season.refetch}
                />
              ) : series ? (
                <SeriesWatchButton
                  name={title}
                  itemID={id}
                  themeColor={theme_color}
                  watchHistory={series.watchHistory}
                  refetchProgression={series.refetch}
                />
              ) : (
                <MovieWatchButton name={title} itemID={id} themeColor={theme_color} />
              ))}
            {(showWatchlistButton || refetchReviews) && (
              <div className="grid grid-cols-4">
                {showWatchlistButton && (
                  <WatchlistButton
                    themeColor={theme_color}
                    movieID={!progression ? id : undefined}
                    seriesID={progression ? id : undefined}
                    name={title}
                  />
                )}
                {refetchReviews && (
                  <ReviewButton
                    themeColor={theme_color}
                    movieID={!progression ? id : undefined}
                    episodeID={episode ? episode.episodeID : undefined}
                    seasonID={season ? season.seasonID : undefined}
                    seriesID={progression ? id : undefined}
                    refetchReviews={refetchReviews}
                  />
                )}
              </div>
            )}
          </>
        ) : (
          <div className="hidden text-white rounded-md md:block">
            <ul className="pl-2 text-left">
              <li className="flex items-center mb-4">
                <AiFillCheckCircle className="flex-shrink-0 w-5 h-5 text-primary" />
                <span className="ml-3 font-medium">Keep track of your watched tv and movies.</span>
              </li>

              <li className="flex items-center mb-4">
                <AiFillCheckCircle className="flex-shrink-0 w-5 h-5 text-primary" />
                <span className="ml-3 font-medium">Personalize your experience.</span>
              </li>
            </ul>
            <button
              className="flex items-center justify-center w-1/2 px-4 py-2 m-auto font-bold rounded-md text-md text-primaryBackground bg-primary"
              onClick={() => signIn()}
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPoster;
