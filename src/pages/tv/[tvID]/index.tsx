import { useScroll, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import WatchTrailerButton from "../../../components/common/buttons/WatchTrailerButton";
import JustWatch from "../../../components/common/JustWatch";
import LoadingPageComponents from "../../../components/common/LoadingPageComponents";
import WatchlistButton from "../../../components/common/WatchlistButton";
import CastBlock from "../../../components/pageBlocks/CastBlock";
import CrewBlock from "../../../components/pageBlocks/CrewBlock";
import DetailsBlock from "../../../components/pageBlocks/DetailsBlock";
import GenresBlock from "../../../components/pageBlocks/GenresBlock";
import SeasonsBlock from "../../../components/pageBlocks/SeasonsBlock";
import SeriesProgressionBlock from "../../../components/pageBlocks/SeriesProgressionBlock";
import { BackdropImage, PosterImage } from "../../../utils/generateImages";
import { trpc } from "../../../utils/trpc";

const TVPage = () => {
  const router = useRouter();
  const session = useSession();
  const { tvID } = router.query;
  const [scrollPosition, setScrollPosition] = useState(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrollPosition(latest);
    });
  }, [scrollY]);

  const { data, status } = trpc.tv.tvById.useQuery({ tvID: tvID as string }, { enabled: router.isReady });

  return (
    <LoadingPageComponents status={status}>
      {() => (
        //   <ContentHeader
        //     cover={data.backdrop_path}
        //     poster={data.poster_path}
        //     title={data.name}
        //     description={data.overview}
        //     genres={data.genres}
        //     score={data.vote_average}
        //     justWatch={data["watch/providers"]}
        //     seriesProgression={data.number_of_episodes_watched}
        //     amountOfEpisodes={data.number_of_episodes}
        //     videos={data.videos}
        //     themeColor={data.theme_color}
        //     seriesID={data.id}
        //   >
        //     <DetailsBlock
        //       status={data.status}
        //       numberOfEpisodes={data.number_of_episodes}
        //       numberOfSeasons={data.number_of_seasons}
        //     />
        //     <SeasonsBlock seasons={data.seasons} />
        //     <CastBlock cast={data.credits.cast} />
        //     <CrewBlock crew={data.credits.crew} />
        //   </ContentHeader>
        // )}
        <>
          <div
            className="absolute w-screen max-w-full h-64 md:h-[32rem] top-0 left-0"
            style={{
              background:
                data.backdrop_path && `url("${BackdropImage({ path: data.backdrop_path, size: "lg" })}") no-repeat`,
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
                      alt={"Poster image for:" + data.name}
                      width="208"
                      height="311"
                      src={PosterImage({ path: data.poster_path, size: "lg" })}
                    />
                  </motion.div>

                  {data.number_of_episodes_watched && data.number_of_episodes && session.status === "authenticated" && (
                    <div className="pt-4 pb-4 md:row-start-auto">
                      <SeriesProgressionBlock
                        amountOfEpisodes={data.number_of_episodes}
                        numberOfEpisodesWatched={data.number_of_episodes_watched}
                        themeColor={data.theme_color}
                      />
                    </div>
                  )}
                  {data.id && session.status === "authenticated" && (
                    <WatchlistButton themeColor={data.theme_color} seriesID={data.id} />
                  )}
                </div>
              </div>

              <div className="col-span-3 px-4">
                <div className="pt-6 text-3xl font-black md:text-6xl drop-shadow-lg">
                  <div className="items-center justify-between md:flex">
                    <h1 className="flex items-end max-w-2xl">
                      <div>{data.name}</div>
                    </h1>
                    {data.vote_average !== undefined && (
                      <span className="flex items-center p-2 text-xl">
                        <AiFillStar className="mr-2 text-primary" size={24} />
                        {data.vote_average > 0 ? data.vote_average.toPrecision(2) + " / 10" : "N/A"}
                      </span>
                    )}
                  </div>
                  <GenresBlock genres={data.genres} themeColor={data.theme_color} />
                </div>
                <div className="grid-cols-5 lg:grid">
                  <p className="max-w-full col-span-3 pt-8 lg:pb-12">{data.overview}</p>
                  <div className="col-span-2 max-w-[200px] w-full lg:ml-auto my-5">
                    {data.videos && <WatchTrailerButton themeColor={data.theme_color} data={data.videos} />}
                    {data["watch/providers"] && (
                      <JustWatch justWatch={data["watch/providers"]} themeColor={data.theme_color} name={data.name} />
                    )}
                  </div>
                </div>

                <DetailsBlock
                  status={data.status}
                  numberOfEpisodes={data.number_of_episodes}
                  numberOfSeasons={data.number_of_seasons}
                />
                <SeasonsBlock seasons={data.seasons} />
                <CastBlock cast={data.credits.cast} />
                <CrewBlock crew={data.credits.crew} />
              </div>
            </div>
          </div>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default TVPage;
