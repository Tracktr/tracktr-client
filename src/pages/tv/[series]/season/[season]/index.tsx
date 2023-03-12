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
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import SeenByBlock from "../../../../../components/pageBlocks/SeenByBlock";
import { useRouter } from "next/router";

const SeasonPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const session = useSession();

  const { data: seriesData, refetch: seriesRefetch } = trpc.tv.seriesById.useQuery({
    seriesID: Number(props.seriesID),
  });

  const {
    data: seasonData,
    status: seasonStatus,
    refetch: seasonRefetch,
    isRefetching: seasonIsRefetching,
  } = trpc.season.seasonByID.useQuery({
    seriesID: Number(props.seriesID),
    seasonNumber: Number(props.seasonNumber),
  });

  const { data: seenBy } = trpc.season.seenBy.useQuery(
    { id: Number(seasonData?.id) },
    { enabled: seasonStatus === "success" }
  );

  const watchHistory = trpc.season.watchHistoryByID.useQuery(
    {
      seasonID: seasonData?.id,
      seriesID: Number(props.seriesID),
    },
    {
      enabled: session.status !== "loading" && seasonData?.id !== undefined,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: reviews,
    refetch: reviewsRefetch,
    isRefetching: isRefetchingReviews,
  } = trpc.review.getReviews.useQuery(
    {
      seasonID: Number(seasonData?.id),
      page: 1,
      pageSize: 3,
      linkedReview: router.query.review && String(router.query.review),
    },
    { enabled: router.isReady && Boolean(seasonData?.id) }
  );

  const refetch = () => {
    seriesRefetch();
    seasonRefetch();
    watchHistory.refetch();
  };

  return (
    <>
      <Head>
        <title>{`${props.seriesName} ${props.seasonName} - Tracktr.`}</title>
        <meta property="og:image" content={PosterImage({ path: props.poster_path, size: "lg" })} />
        <meta
          name="description"
          content={`Track ${props.seriesName} ${props.seasonName} and other series & movies with Tracktr.`}
        />
      </Head>
      <LoadingPageComponents status={seasonStatus} notFound>
        {() => (
          <>
            <ContentBackdrop path={seriesData.backdrop_path} />
            <ContentGrid>
              <ContentPoster
                title={seasonData.name}
                poster={seasonData.poster_path}
                id={Number(props.seriesID)}
                theme_color={seriesData.theme_color}
                progression={{
                  number_of_episodes: seriesData.number_of_episodes,
                  number_of_episodes_watched: seriesData.number_of_episodes_watched,
                }}
                season={{
                  refetch: refetch,
                  seasonID: Number(seasonData.id),
                  seasonNumber: Number(props.seasonNumber),
                  watchHistory,
                }}
                refetchReviews={reviewsRefetch}
                userReview={
                  (reviews?.reviews || []).filter((e: any) => e.user_id === session.data?.user?.id).length > 0 &&
                  reviews?.reviews[0].content
                }
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
                {session.status === "authenticated" ? <SeenByBlock data={seenBy} /> : <></>}
                <CastBlock cast={seasonData.credits.cast} />
                <CrewBlock crew={seasonData.credits.crew} />
                <ReviewsBlock
                  reviews={reviews?.reviews || []}
                  refetchReviews={reviewsRefetch}
                  isRefetching={isRefetchingReviews}
                  themeColor={seasonData.theme_color}
                  linkedReview={reviews?.linkedReview}
                />
              </ContentMain>
            </ContentGrid>
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
    throw new Error("Not Found");
  }

  const season = series.seasons.filter((s: any) => s.season_number === Number(context.query.season));

  return {
    props: {
      seriesID: series.id,
      seriesName: series.name,
      seasonName: season[0].name,
      seasonNumber: season[0].season_number,
      seasonPoster: season[0].poster_path,
    },
  };
};

export default SeasonPage;
