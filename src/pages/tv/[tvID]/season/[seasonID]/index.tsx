import { useRouter } from "next/router";
import LoadingPageComponents from "../../../../../components/common/LoadingPageComponents";
import CastBlock from "../../../../../components/pageBlocks/CastBlock";
import CrewBlock from "../../../../../components/pageBlocks/CrewBlock";
import EpisodesBlock from "../../../../../components/pageBlocks/EpisodesBlock";
import { trpc } from "../../../../../utils/trpc";
import ContentBackdrop from "../../../../../components/pageBlocks/ContentBackdrop";
import ContentPoster from "../../../../../components/pageBlocks/ContentPoster";
import ContentOverview from "../../../../../components/pageBlocks/ContentOverview";
import ContentTitle from "../../../../../components/pageBlocks/ContentTitle";

const TVPage = () => {
  const router = useRouter();
  const { tvID, seasonID } = router.query;

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
          <ContentBackdrop path={tvShow.backdrop_path} />

          <div className="relative w-full">
            <div className="grid max-w-6xl grid-cols-1 pt-24 m-auto md:grid-cols-4 md:pt-96">
              <ContentPoster
                hideWatchButton
                title={data.name}
                poster={data.poster_path}
                id={data.id}
                theme_color={tvShow.theme_color}
                progression={{
                  number_of_episodes: tvShow.number_of_episodes,
                  number_of_episodes_watched: tvShow.number_of_episodes_watched,
                }}
              />

              <div className="col-span-3 px-4">
                <ContentTitle theme_color={tvShow.theme_color} title={data.name} score={data.vote_average} />
                <ContentOverview
                  name={data.name}
                  overview={data.overview}
                  theme_color={tvShow.theme_color}
                  videos={tvShow.videos}
                  justwatch={tvShow["watch/providers"]}
                />
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
