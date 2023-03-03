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
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../../../../server/trpc/router/_app";
import { createContext } from "../../../../../server/trpc/context";
import SuperJSON from "superjson";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";

const SeasonReviewsPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const session = useSession();
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
  } = trpc.review.getReviews.useQuery({ seasonID: Number(seasonData.id), page, pageSize: 25 });

  const nextPage = () => {
    setPage(page + 1);
    refetch();
  };

  const previousPage = () => {
    setPage(page - 1);
    refetch();
  };

  return (
    <LoadingPageComponents status={seasonStatus} notFound>
      {() => (
        <>
          <Head>
            <title>{`${seriesData.name} ${seasonData.name} Reviews - Tracktr.`}</title>
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
              refetchReviews={seasonRefetch}
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
  await ssg.season.seasonByID.prefetch({
    seriesID: Number(context.query.series),
    seasonNumber: Number(context.query.season),
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      seriesID: context.query.series,
      seasonNumber: context.query.season,
    },
  };
};

export default SeasonReviewsPage;
