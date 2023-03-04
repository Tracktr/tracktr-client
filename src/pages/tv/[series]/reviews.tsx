import LoadingPageComponents from "../../../components/common/LoadingPageComponents";
import ContentBackdrop from "../../../components/pageBlocks/ContentBackdrop";
import PosterButton from "../../../components/pageBlocks/ContentPoster";
import { trpc } from "../../../utils/trpc";
import ContentTitle from "../../../components/pageBlocks/ContentTitle";
import ContentGrid from "../../../components/pageBlocks/ContentGrid";
import ContentMain from "../../../components/pageBlocks/ContentMain";
import ReviewsBlock from "../../../components/pageBlocks/ReviewsBlock";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { PosterImage } from "../../../utils/generateImages";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../../server/trpc/router/_app";
import { createContext } from "../../../server/trpc/context";
import SuperJSON from "superjson";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

const TVReviewsPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const session = useSession();
  const router = useRouter();
  const [page, setPage] = useState(1);

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

  const { data: reviews, refetch: reviewsRefetch } = trpc.review.getReviews.useQuery(
    {
      seriesID: Number(props.seriesID),
      page,
      pageSize: 25,
      linkedReview: router.query.review && String(router.query.review),
    },
    { enabled: router.isReady }
  );

  const refetch = () => {
    seriesRefetch();
    watchHistory.refetch();
  };

  const nextPage = () => {
    setPage(page + 1);
    refetch();
  };

  const previousPage = () => {
    setPage(page - 1);
    refetch();
  };

  return (
    <LoadingPageComponents status={status} notFound>
      {() => (
        <>
          <Head>
            <title>{`${seriesData.name} Reviews - Tracktr.`}</title>
            <meta property="og:image" content={PosterImage({ path: seriesData.poster_path, size: "lg" })} />
            <meta name="description" content={`Track ${seriesData.name} and other series & movies with Tracktr.`} />
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
              refetchReviews={
                seriesData.reviews.filter((e: any) => e.user_id === session.data?.user?.id).length < 1
                  ? refetch
                  : undefined
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
              <ReviewsBlock
                reviewPage
                reviews={reviews?.reviews || []}
                refetchReviews={reviewsRefetch}
                isRefetching={isRefetching}
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
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext({ req: context.req, res: context.res }),
    transformer: SuperJSON,
  });
  await ssg.tv.seriesById.prefetch({ seriesID: Number(context.query.series) });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      seriesID: context.query.series,
    },
  };
};

export default TVReviewsPage;
