import { useRouter } from "next/router";
import { AiFillStar } from "react-icons/ai";
import WatchTrailerButton from "../../../components/common/buttons/WatchTrailerButton";
import JustWatch from "../../../components/common/JustWatch";
import LoadingPageComponents from "../../../components/common/LoadingPageComponents";
import Backdrop from "../../../components/pageBlocks/Backdrop";
import CastBlock from "../../../components/pageBlocks/CastBlock";
import CrewBlock from "../../../components/pageBlocks/CrewBlock";
import DetailsBlock from "../../../components/pageBlocks/DetailsBlock";
import GenresBlock from "../../../components/pageBlocks/GenresBlock";
import PosterButton from "../../../components/pageBlocks/PosterButtons";
import SeasonsBlock from "../../../components/pageBlocks/SeasonsBlock";
import { trpc } from "../../../utils/trpc";

const TVPage = () => {
  const router = useRouter();
  const { tvID } = router.query;

  const { data, status } = trpc.tv.tvById.useQuery({ tvID: tvID as string }, { enabled: router.isReady });

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <>
          <Backdrop path={data.backdrop_path} />

          <div className="relative w-full">
            <div className="grid max-w-6xl grid-cols-1 pt-24 m-auto md:grid-cols-4 md:pt-96">
              <PosterButton
                hideWatchButton
                showWatchlistButton
                title={data.title}
                poster={data.poster_path}
                id={data.id}
                theme_color={data.theme_color}
                progression={{
                  number_of_episodes: data.number_of_episodes,
                  number_of_episodes_watched: data.number_of_episodes_watched,
                }}
              />

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
