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
import ReviewsBlock from "../../../../../components/pageBlocks/ReviewsBlock";
import Head from "next/head";
import { PosterImage } from "../../../../../utils/generateImages";

const TVPage = () => {
  const router = useRouter();
  const session = useSession();
  const { series: seriesID, season: seasonNumber } = router.query;

  const { data: seriesData, refetch: seriesRefetch } = trpc.tv.seriesById.useQuery(
    {
      seriesID: Number(seriesID),
    },
    { enabled: router.isReady }
  );

  const {
    data: seasonData,
    status: seasonStatus,
    refetch: seasonRefetch,
    isRefetching: seasonIsRefetching,
  } = trpc.season.seasonByID.useQuery(
    {
      seriesID: Number(seriesID),
      seasonNumber: Number(seasonNumber),
    },
    { enabled: router.isReady }
  );

  const watchHistory = trpc.season.watchHistoryByID.useQuery(
    {
      seasonID: seasonData?.id,
      seriesID: Number(seriesID),
    },
    {
      enabled: session.status !== "loading" && seasonData?.id !== undefined,
      refetchOnWindowFocus: false,
    }
  );

  const refetch = () => {
    seriesRefetch();
    seasonRefetch();
    watchHistory.refetch();
  };

  return (
    <LoadingPageComponents status={seasonStatus} notFound>
      {() => (
        <>
          <Head>
            <title>
              {seriesData.name} {seasonData.name} - Tracktr.
            </title>
            <meta property="og:image" content={PosterImage({ path: seriesData.poster_path, size: "lg" })} />
            <meta
              name="description"
              content={`Track ${seriesData.name} ${seasonData.name} and other series & movies with Tracktr.`}
            />
          </Head>

          <ContentBackdrop path={seriesData.backdrop_path} />

          <ContentGrid>
            <ContentPoster
              title={seasonData.name}
              poster={seasonData.poster_path}
              id={Number(seriesID)}
              theme_color={seriesData.theme_color}
              progression={{
                number_of_episodes: seriesData.number_of_episodes,
                number_of_episodes_watched: seriesData.number_of_episodes_watched,
              }}
              season={{
                refetch: refetch,
                seasonID: Number(seasonData.id),
                seasonNumber: Number(seasonNumber),
                watchHistory,
              }}
              refetchReviews={seasonRefetch}
            />

            <ContentMain>
              <ContentTitle
                theme_color={seriesData.theme_color}
                title={seasonData.name}
                score={seasonData.vote_average}
              />
              <ContentOverview
                name={seasonData.name}
                overview={seasonData.overview}
                theme_color={seriesData.theme_color}
                videos={seriesData.videos}
                justwatch={seriesData["watch/providers"]}
              />
              <EpisodesBlock
                episodes={seasonData.episodes}
                refetch={refetch}
                fetchStatus={seasonIsRefetching}
                themeColor={seriesData.theme_color}
              />
              <CastBlock cast={seasonData.credits.cast} />
              <CrewBlock crew={seasonData.credits.crew} />
              <ReviewsBlock
                reviews={seasonData.reviews}
                refetchReviews={seasonRefetch}
                isRefetching={seasonIsRefetching}
              />
            </ContentMain>
          </ContentGrid>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default TVPage;
