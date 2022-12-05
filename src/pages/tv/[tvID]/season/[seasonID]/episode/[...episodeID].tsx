import { useRouter } from "next/router";
import LoadingPageComponents from "../../../../../../components/common/LoadingPageComponents";
import CastBlock from "../../../../../../components/pageBlocks/CastBlock";
import CrewBlock from "../../../../../../components/pageBlocks/CrewBlock";
import EpisodeSwitcherBlock from "../../../../../../components/pageBlocks/EpisodeSwitcherBlock";
import { trpc } from "../../../../../../utils/trpc";
import { useScroll, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { BackdropImage, PosterImage } from "../../../../../../utils/generateImages";
import SeriesProgressionBlock from "../../../../../../components/pageBlocks/SeriesProgressionBlock";
import EpisodeWatchButton from "../../../../../../components/watchButton/EpisodeWatchButton";
import { AiFillStar } from "react-icons/ai";
import WatchTrailerButton from "../../../../../../components/common/buttons/WatchTrailerButton";
import JustWatch from "../../../../../../components/common/JustWatch";

const EpisodePage = () => {
  const router = useRouter();
  const session = useSession();
  const { tvID, seasonID, episodeID } = router.query;
  const [scrollPosition, setScrollPosition] = useState(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrollPosition(latest);
    });
  }, [scrollY]);

  const { data: tvShow, refetch } = trpc.tv.tvById.useQuery(
    {
      tvID: tvID as string,
    },
    { enabled: router.isReady }
  );

  const { data: episodeData, status: episodeStatus } = trpc.episode.episodeById.useQuery(
    {
      tvID: tvID as string,
      seasonID: seasonID as string,
      episodeID: episodeID ? episodeID[0] : undefined,
    },
    { enabled: router.isReady }
  );

  return (
    <LoadingPageComponents status={episodeStatus}>
      {() => (
        <>
          <div
            className="absolute w-screen max-w-full h-64 md:h-[32rem] top-0 left-0"
            style={{
              background:
                tvShow.backdrop_path && `url("${BackdropImage({ path: tvShow.backdrop_path, size: "lg" })}") no-repeat`,
              backgroundSize: "cover",
            }}
          >
            <div className="relative w-full h-full bg-gradient-to-t from-primaryBackground" />
          </div>

          <div className="relative w-full">
            <div className="grid max-w-6xl grid-cols-1 pt-24 m-auto md:grid-cols-4 md:pt-96">
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
                      alt={"Poster image for:" + episodeData.name}
                      width="208"
                      height="311"
                      src={PosterImage({ path: tvShow.poster_path, size: "lg" })}
                    />
                  </motion.div>

                  {tvShow.number_of_episodes_watched &&
                    tvShow.number_of_episodes &&
                    session.status === "authenticated" && (
                      <div className="pt-4 pb-4 md:row-start-auto">
                        <SeriesProgressionBlock
                          amountOfEpisodes={tvShow.number_of_episodes}
                          numberOfEpisodesWatched={tvShow.number_of_episodes_watched}
                          themeColor={tvShow.theme_color}
                        />
                      </div>
                    )}
                  {tvID && session.status === "authenticated" && (
                    <EpisodeWatchButton
                      itemID={Number(tvID)}
                      episodeID={Number(episodeID)}
                      seasonID={Number(seasonID)}
                      themeColor={tvShow.theme_color}
                      refetchProgression={refetch}
                    />
                  )}
                </div>
              </div>

              <div className="col-span-3 px-4">
                <div className="pt-6 text-3xl font-black md:text-6xl drop-shadow-lg">
                  <div className="items-center justify-between md:flex">
                    <h1 className="flex items-end max-w-2xl">
                      <div>
                        {episodeData.season_number?.toString() && episodeData.episode_number?.toString() && (
                          <div className="flex">
                            <span
                              style={{
                                background: tvShow.theme_color?.hex,
                              }}
                              className={`
                            inline-block px-3 py-1 text-xs rounded-full       
                            ${tvShow.theme_color.isDark && "text-white"}
                            ${tvShow.theme_color.isLight && "text-primaryBackground"}
                          `}
                            >
                              {episodeData.season_number}x{episodeData.episode_number}
                            </span>
                          </div>
                        )}
                        {episodeData.name}
                        {episodeData.air_date && (
                          <span className="ml-4 text-xl opacity-75 md:text-4xl drop-shadow-md">
                            {episodeData.air_date.slice(0, 4)}
                          </span>
                        )}
                      </div>
                    </h1>
                    {episodeData.vote_average !== undefined && (
                      <span className="flex items-center p-2 text-xl">
                        <AiFillStar className="mr-2 text-primary" size={24} />
                        {episodeData.vote_average > 0 ? episodeData.vote_average.toPrecision(2) + " / 10" : "N/A"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid-cols-5 lg:grid">
                  <p className="max-w-full col-span-3 pt-8 lg:pb-12">{episodeData.overview}</p>
                  <div className="col-span-2 max-w-[200px] w-full lg:ml-auto my-5">
                    {tvShow.videos && <WatchTrailerButton themeColor={tvShow.theme_color} data={tvShow.videos} />}
                    {tvShow["watch/providers"] && (
                      <JustWatch
                        justWatch={tvShow["watch/providers"]}
                        themeColor={tvShow.theme_color}
                        name={episodeData.name}
                      />
                    )}
                  </div>
                </div>

                <CastBlock cast={episodeData.credits.cast} />
                <CrewBlock crew={episodeData.credits.crew} />
                <EpisodeSwitcherBlock seasons={tvShow.seasons} />
              </div>
            </div>
          </div>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default EpisodePage;
