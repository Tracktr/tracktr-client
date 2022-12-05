import { useRouter } from "next/router";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import CastBlock from "../../components/pageBlocks/CastBlock";
import CrewBlock from "../../components/pageBlocks/CrewBlock";
import DetailsBlock from "../../components/pageBlocks/DetailsBlock";
import { PosterImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";
import { useScroll, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import WatchlistButton from "../../components/common/WatchlistButton";
import MovieWatchButton from "../../components/watchButton/MovieWatchButton";
import { AiFillStar } from "react-icons/ai";
import GenresBlock from "../../components/pageBlocks/GenresBlock";
import JustWatch from "../../components/common/JustWatch";
import WatchTrailerButton from "../../components/common/buttons/WatchTrailerButton";
import Backdrop from "../../components/pageBlocks/Backdrop";

const MoviePage = () => {
  const router = useRouter();
  const session = useSession();
  const { slug } = router.query;
  const { data, status } = trpc.movie.movieById.useQuery({ slug: slug ? slug[0] : undefined });
  const [scrollPosition, setScrollPosition] = useState(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrollPosition(latest);
    });
  }, [scrollY]);

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <>
          <Backdrop path={data.backdrop_path} />

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
                      alt={"Poster image for:" + data.title}
                      width="208"
                      height="311"
                      src={PosterImage({ path: data.poster_path, size: "lg" })}
                    />
                  </motion.div>

                  {data.id && session.status === "authenticated" && (
                    <MovieWatchButton itemID={data.id} themeColor={data.theme_color} />
                  )}
                  {data.id && session.status === "authenticated" && (
                    <WatchlistButton themeColor={data.theme_color} movieID={data.id} />
                  )}
                </div>
              </div>

              <div className="col-span-3 px-4">
                <div className="pt-6 text-3xl font-black md:text-6xl drop-shadow-lg">
                  <div className="items-center justify-between md:flex">
                    <h1 className="flex items-end max-w-2xl">
                      <div>
                        {data.title}
                        {data.release_date && (
                          <span className="ml-4 text-xl opacity-75 md:text-4xl drop-shadow-md">
                            {data.release_date.slice(0, 4)}
                          </span>
                        )}
                      </div>
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
                      <JustWatch justWatch={data["watch/providers"]} themeColor={data.theme_color} name={data.title} />
                    )}
                  </div>
                </div>
                <DetailsBlock
                  budget={data.budget}
                  releaseDate={data.release_date}
                  revenue={data.revenue}
                  runtime={data.runtime}
                  status={data.status}
                />
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

export default MoviePage;
