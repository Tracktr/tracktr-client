import LoadingPageComponents from "../../../../../components/common/LoadingPageComponents";
import { trpc } from "../../../../../utils/trpc";
import ContentBackdrop from "../../../../../components/pageBlocks/ContentBackdrop";
import ContentPoster from "../../../../../components/pageBlocks/ContentPoster";
import ContentTitle from "../../../../../components/pageBlocks/ContentTitle";
import ContentGrid from "../../../../../components/pageBlocks/ContentGrid";
import ContentMain from "../../../../../components/pageBlocks/ContentMain";
import { useSession } from "next-auth/react";
import ReviewsBlock from "../../../../../components/pageBlocks/ReviewsBlock";
import Head from "next/head";
import { PosterImage } from "../../../../../utils/generateImages";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

const SeasonReviewsPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const session = useSession();
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data: seriesData, refetch: seriesRefetch } = trpc.tv.seriesById.useQuery({
    seriesID: Number(props.seriesID),
  });

  const {
    data: seasonData,
    status: seasonStatus,
    refetch: seasonRefetch,
  } = trpc.season.seasonByID.useQuery({
    seriesID: Number(props.seriesID),
    seasonNumber: Number(props.seasonNumber),
  });

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

  const refetch = () => {
    seriesRefetch();
    seasonRefetch();
    watchHistory.refetch();
  };
  const {
    data: reviews,
    refetch: reviewsRefetch,
    isRefetching: isReviewsRefetching,
  } = trpc.review.getReviews.useQuery(
    {
      seasonID: Number(seasonData?.id),
      page,
      pageSize: 25,
      linkedReview: router.query.review && String(router.query.review),
    },
    { enabled: router.isReady }
  );

  const nextPage = () => {
    setPage(page + 1);
    refetch();
  };

  const previousPage = () => {
    setPage(page - 1);
    refetch();
  };

  return (
    <>
      <Head>
        <title>{`Reviews for ${props.seriesName} ${props.seasonName} - Tracktr.`}</title>
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
                <ReviewsBlock
                  reviewPage
                  reviews={reviews?.reviews || []}
                  refetchReviews={reviewsRefetch}
                  isRefetching={isReviewsRefetching}
                  themeColor={seriesData.theme_color}
                  linkedReview={reviews?.linkedReview}
                />
                {(reviews?.reviews || [])?.length > 0 ? (
                  <div className="flex items-center justify-center gap-4 m-5 align-middle">
                    <button className="text-sm disabled:text-gray-500" onClick={previousPage} disabled={page < 2}>
                      Previous page
                    </button>
                    <div className="flex items-center gap-4 mx-6">
                      <button onClick={previousPage} className="p-2 text-xs text-gray-200">
                        {page > 1 && page - 1}
                      </button>
                      <div>{page}</div>
                      <button onClick={nextPage} className="p-2 text-xs text-gray-200">
                        {page < Number(reviews?.pagesAmount) && page + 1}
                      </button>
                    </div>
                    <button
                      className="text-sm disabled:text-gray-500"
                      onClick={nextPage}
                      disabled={page >= Number(reviews?.pagesAmount)}
                    >
                      Next page
                    </button>
                  </div>
                ) : (
                  <></>
                )}
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

export default SeasonReviewsPage;
