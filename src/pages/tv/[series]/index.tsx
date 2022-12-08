import { useRouter } from "next/router";
import LoadingPageComponents from "../../../components/common/LoadingPageComponents";
import ContentBackdrop from "../../../components/pageBlocks/ContentBackdrop";
import CastBlock from "../../../components/pageBlocks/CastBlock";
import CrewBlock from "../../../components/pageBlocks/CrewBlock";
import DetailsBlock from "../../../components/pageBlocks/DetailsBlock";
import PosterButton from "../../../components/pageBlocks/ContentPoster";
import SeasonsBlock from "../../../components/pageBlocks/SeasonsBlock";
import { trpc } from "../../../utils/trpc";
import ContentOverview from "../../../components/pageBlocks/ContentOverview";
import ContentTitle from "../../../components/pageBlocks/ContentTitle";
import ContentGrid from "../../../components/pageBlocks/ContentGrid";
import ContentMain from "../../../components/pageBlocks/ContentMain";
import ReviewsBlock from "../../../components/pageBlocks/ReviewsBlock";
import { useSession } from "next-auth/react";
import Head from "next/head";
import RecommendationsBlock from "../../../components/pageBlocks/RecommendationsBlock";

const TVPage = () => {
  const router = useRouter();
  const session = useSession();
  const { series: seriesID } = router.query;

  const {
    data: seriesData,
    status,
    refetch,
    isRefetching,
  } = trpc.tv.seriesById.useQuery({ seriesID: Number(seriesID) }, { enabled: router.isReady });

  const watchHistory = trpc.tv.watchHistoryByID.useQuery(
    {
      seriesID: Number(seriesID),
    },
    {
      enabled: session.status !== "loading",
      refetchOnWindowFocus: false,
    }
  );

  return (
    <LoadingPageComponents status={status} notFound>
      {() => (
        <>
          <Head>
            <title>{seriesData.name} - Tracktr.</title>
          </Head>

          <ContentBackdrop path={seriesData.backdrop_path} />

          <ContentGrid>
            <PosterButton
              showWatchlistButton
              title={seriesData.name}
              poster={seriesData.poster_path}
              id={seriesData.id}
              theme_color={seriesData.theme_color}
              progression={{
                number_of_episodes: seriesData.number_of_episodes,
                number_of_episodes_watched: seriesData.number_of_episodes_watched,
              }}
              refetchReviews={refetch}
              series={{
                refetch: refetch,
                watchHistory,
              }}
            />

            <ContentMain>
              <ContentTitle
                theme_color={seriesData.theme_color}
                title={seriesData.name}
                score={seriesData.vote_average}
                air_date={seriesData.air_date}
                genres={seriesData.genres}
              />
              <ContentOverview
                name={seriesData.name}
                overview={seriesData.overview}
                theme_color={seriesData.theme_color}
                videos={seriesData.videos}
                justwatch={seriesData["watch/providers"]}
              />

              <DetailsBlock
                status={seriesData.status}
                numberOfEpisodes={seriesData.number_of_episodes}
                numberOfSeasons={seriesData.number_of_seasons}
              />
              <SeasonsBlock seasons={seriesData.seasons} />
              <CastBlock cast={seriesData.credits.cast} />
              <CrewBlock crew={seriesData.credits.crew} />
              <ReviewsBlock reviews={seriesData.reviews} refetchReviews={refetch} isRefetching={isRefetching} />
            </ContentMain>
          </ContentGrid>
          <RecommendationsBlock type="tv" recommendations={seriesData.recommendations} />
        </>
      )}
    </LoadingPageComponents>
  );
};

export default TVPage;
