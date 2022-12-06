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
import ContentGrid from "../../../../../components/pageBlocks/ContentGrid";
import ContentMain from "../../../../../components/pageBlocks/ContentMain";
import { useSession } from "next-auth/react";

const TVPage = () => {
  const router = useRouter();
  const session = useSession();
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

  const watchHistory = trpc.season.watchHistoryByID.useQuery(
    {
      seasonNumber: Number(seasonID),
      seriesId: Number(tvID),
    },
    {
      enabled: session.status !== "loading",
      refetchOnWindowFocus: false,
    }
  );

  const refetch = () => {
    tvRefetch();
    seasonRefetch();
    watchHistory.refetch();
  };

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <>
          <ContentBackdrop path={tvShow.backdrop_path} />

          <ContentGrid>
            <ContentPoster
              title={data.name}
              poster={data.poster_path}
              id={Number(tvID)}
              theme_color={tvShow.theme_color}
              progression={{
                number_of_episodes: tvShow.number_of_episodes,
                number_of_episodes_watched: tvShow.number_of_episodes_watched,
              }}
              season={{
                refetch: refetch,
                seasonID: Number(seasonID),
                watchHistory,
              }}
            />

            <ContentMain>
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
              <CrewBlock crew={data.credits.crew} />
            </ContentMain>
          </ContentGrid>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default TVPage;
