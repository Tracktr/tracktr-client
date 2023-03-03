import LoadingPageComponents from "../../../components/common/LoadingPageComponents";
import { trpc } from "../../../utils/trpc";
import ContentBackdrop from "../../../components/pageBlocks/ContentBackdrop";
import ContentPoster from "../../../components/pageBlocks/ContentPoster";
import ContentTitle from "../../../components/pageBlocks/ContentTitle";
import ContentGrid from "../../../components/pageBlocks/ContentGrid";
import ContentMain from "../../../components/pageBlocks/ContentMain";
import ReviewsBlock from "../../../components/pageBlocks/ReviewsBlock";
import Head from "next/head";
import { PosterImage } from "../../../utils/generateImages";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../../server/trpc/router/_app";
import { createContext } from "../../../server/trpc/context";
import SuperJSON from "superjson";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";

const MovieReviewsPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [page, setPage] = useState(1);
  const { data, status, refetch, isRefetching } = trpc.movie.movieById.useQuery({ slug: props.movieID });

  const { data: reviews, refetch: reviewsRefetch } = trpc.review.getReviews.useQuery({
    movieID: Number(props.movieID),
    page,
    pageSize: 25,
  });

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
            <title>{`${data.title} Reviews - Tracktr.`}</title>
            <meta property="og:image" content={PosterImage({ path: data.poster_path, size: "lg" })} />
            <meta name="description" content={`Track ${data.title} and other movies & series with Tracktr.`} />
          </Head>

          <ContentBackdrop path={data.backdrop_path} />

          <ContentGrid>
            <ContentPoster
              showWatchlistButton
              title={data.title}
              poster={data.poster_path}
              id={data.id}
              theme_color={data.theme_color}
              refetchReviews={refetch}
            />

            <ContentMain>
              <ContentTitle
                theme_color={data.theme_color}
                title={data.title}
                score={data.vote_average}
                air_date={data.release_date}
                genres={data.genres}
              />
              <ReviewsBlock
                reviewPage
                reviews={reviews?.reviews || []}
                refetchReviews={reviewsRefetch}
                isRefetching={isRefetching}
                themeColor={data.theme_color}
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
  await ssg.movie.movieById.prefetch({ slug: String(context.query.movieID) });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      movieID: context.query.movieID,
    },
  };
};

export default MovieReviewsPage;
