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
import { PosterImage } from "../../../utils/generateImages";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import SeenByBlock from "../../../components/pageBlocks/SeenByBlock";
import { useRouter } from "next/router";

const TVPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const session = useSession();
  const router = useRouter();

  const {
    data: seriesData,
    status,
    refetch: seriesRefetch,
    isRefetching,
  } = trpc.tv.seriesById.useQuery({ seriesID: Number(props.seriesID) });

  const watchHistory = trpc.tv.watchHistoryByID.useQuery(
    {
      seriesID: Number(props.seriesID),
    },
    {
      enabled: session.status !== "loading",
    }
  );

  const {
    data: reviews,
    refetch: reviewsRefetch,
    isRefetching: isRefetchingReviews,
  } = trpc.review.getReviews.useQuery(
    {
      seriesID: Number(props.seriesID),
      page: 1,
      pageSize: 3,
      linkedReview: router.query.review && String(router.query.review),
    },
    { enabled: router.isReady }
  );

  const refetch = () => {
    seriesRefetch();
    watchHistory.refetch();
  };

  const { data: seenBy } = trpc.tv.seenBy.useQuery(
    { id: Number(props.seriesID) },
    { enabled: status === "success" && session.status === "authenticated" }
  );

  return (
    <>
      <Head>
        <title>{`${props.seriesName} - Tracktr.`}</title>
        <meta property="og:image" content={PosterImage({ path: props.seriesPoster, size: "lg" })} />
        <meta name="description" content={`Track ${props.seriesName} and other series & movies with Tracktr.`} />
      </Head>
      <LoadingPageComponents status={status} notFound>
        {() => (
          <>
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
                refetchReviews={reviewsRefetch}
                userReview={
                  (reviews?.reviews || []).filter((e: any) => e.user_id === session.data?.user?.id).length > 0 &&
                  reviews?.reviews[0].content
                }
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
                {session.status === "authenticated" ? <SeenByBlock data={seenBy} /> : <></>}
                <SeasonsBlock seasons={seriesData.seasons} refetch={refetch} isRefetching={isRefetching} />
                <CastBlock cast={seriesData.credits.cast} />
                <CrewBlock crew={seriesData.credits.crew} />
                <ReviewsBlock
                  reviews={reviews?.reviews || []}
                  refetchReviews={reviewsRefetch}
                  isRefetching={isRefetchingReviews}
                  themeColor={seriesData.theme_color}
                  linkedReview={reviews?.linkedReview}
                />
              </ContentMain>
            </ContentGrid>
            <RecommendationsBlock type="tv" recommendations={seriesData.recommendations} />
          </>
        )}
      </LoadingPageComponents>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const seriesUrl = new URL(`tv/${Number(context.query.series)}`, process.env.NEXT_PUBLIC_TMDB_API);
  seriesUrl.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

  const series = await fetch(seriesUrl).then((res) => res.json());

  if (series?.status_code) {
    throw new Error("Not FOund");
  }

  return {
    props: {
      seriesID: series.id,
      seriesName: series.name,
      seriesPoster: series.poster_path,
    },
  };
};

export default TVPage;
