import { useRouter } from "next/router";
import LoadingPageComponents from "../../../../../components/common/LoadingPageComponents";
import CastBlock from "../../../../../components/pageBlocks/CastBlock";
import CrewBlock from "../../../../../components/pageBlocks/CrewBlock";
import EpisodesBlock from "../../../../../components/pageBlocks/EpisodesBlock";
import { trpc } from "../../../../../utils/trpc";
import { useScroll, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PosterImage } from "../../../../../utils/generateImages";
import Image from "next/image";
import SeriesProgressionBlock from "../../../../../components/pageBlocks/SeriesProgressionBlock";
import WatchTrailerButton from "../../../../../components/common/buttons/WatchTrailerButton";
import JustWatch from "../../../../../components/common/JustWatch";
import Backdrop from "../../../../../components/contentHeader/Backdrop";

const TVPage = () => {
  const router = useRouter();
  const session = useSession();
  const { tvID, seasonID } = router.query;
  const [scrollPosition, setScrollPosition] = useState(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrollPosition(latest);
    });
  }, [scrollY]);

  const { data: tvShow, refetch: tvRefetch } = trpc.tv.tvById.useQuery(
    {
      tvID: tvID as string,
    },
    { enabled: router.isReady }
  );

  const {
    data,
    status,
    refetch: seasonRefetch,
    isRefetching,
  } = trpc.season.seasonByID.useQuery(
    {
      tvID: tvID as string,
      seasonID: Number(seasonID),
    },
    { enabled: router.isReady }
  );

  const refetch = () => {
    tvRefetch();
    seasonRefetch();
  };

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <>
          <Backdrop path={tvShow.backdrop_path} />

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
                      alt={"Poster image for:" + data.name}
                      width="208"
                      height="311"
                      src={PosterImage({ path: data.poster_path, size: "lg" })}
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
                </div>
              </div>

              <div className="col-span-3 px-4">
                <div className="pt-6 text-3xl font-black md:text-6xl drop-shadow-lg">
                  <div className="items-center justify-between md:flex">
                    <h1 className="flex items-end max-w-2xl">
                      <div>{data.name}</div>
                    </h1>
                  </div>
                </div>
                <div className="grid-cols-5 lg:grid">
                  <p className="max-w-full col-span-3 pt-8 lg:pb-12">{data.overview}</p>
                  <div className="col-span-2 max-w-[200px] w-full lg:ml-auto my-5">
                    {tvShow.videos && <WatchTrailerButton themeColor={tvShow.theme_color} data={tvShow.videos} />}
                    {tvShow["watch/providers"] && (
                      <JustWatch
                        justWatch={tvShow["watch/providers"]}
                        themeColor={tvShow.theme_color}
                        name={data.name}
                      />
                    )}
                  </div>
                </div>
                <EpisodesBlock
                  episodes={data.episodes}
                  refetch={refetch}
                  fetchStatus={isRefetching}
                  themeColor={tvShow.theme_color}
                />
                <CastBlock cast={data.credits.cast} />
                <CrewBlock crew={data.credits.crew} />{" "}
              </div>
            </div>
          </div>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default TVPage;
