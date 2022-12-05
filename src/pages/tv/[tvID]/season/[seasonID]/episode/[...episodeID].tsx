import { useRouter } from "next/router";
import LoadingPageComponents from "../../../../../../components/common/LoadingPageComponents";
import CastBlock from "../../../../../../components/pageBlocks/CastBlock";
import CrewBlock from "../../../../../../components/pageBlocks/CrewBlock";
import EpisodeSwitcherBlock from "../../../../../../components/pageBlocks/EpisodeSwitcherBlock";
import { trpc } from "../../../../../../utils/trpc";
import { AiFillStar } from "react-icons/ai";
import WatchTrailerButton from "../../../../../../components/common/buttons/WatchTrailerButton";
import JustWatch from "../../../../../../components/common/JustWatch";
import Backdrop from "../../../../../../components/pageBlocks/Backdrop";
import ContentPoster from "../../../../../../components/pageBlocks/ContentPoster";
import ContentOverview from "../../../../../../components/pageBlocks/ContentOverview";

const EpisodePage = () => {
  const router = useRouter();
  const { tvID, seasonID, episodeID } = router.query;

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
          <Backdrop path={tvShow.backdrop_path} />

          <div className="relative w-full">
            <div className="grid max-w-6xl grid-cols-1 pt-24 m-auto md:grid-cols-4 md:pt-96">
              <ContentPoster
                title={episodeData.name}
                poster={tvShow.poster_path}
                id={Number(tvID)}
                theme_color={tvShow.theme_color}
                progression={{
                  number_of_episodes: tvShow.number_of_episodes,
                  number_of_episodes_watched: tvShow.number_of_episodes_watched,
                }}
                episode={{
                  episodeID: Number(episodeID),
                  refetch: refetch,
                  seasonID: Number(seasonID),
                }}
              />

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
                <ContentOverview
                  name={episodeData.name}
                  overview={episodeData.overview}
                  theme_color={tvShow.theme_color}
                  videos={tvShow.videos}
                  justwatch={tvShow["watch/providers"]}
                />

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
