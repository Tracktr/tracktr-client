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
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const MovieReviewsPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const session = useSession();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, status, refetch: movieRefetch, isRefetching } = trpc.movie.movieById.useQuery({ slug: props.movieID });

  const { data: reviews, refetch: reviewsRefetch } = trpc.review.getReviews.useQuery(
    {
      movieID: Number(props.movieID),
      page,
      pageSize: 25,
      linkedReview: router.query.review && String(router.query.review),
    },
    { enabled: router.isReady }
  );

  const refetch = () => {
    movieRefetch();
    reviewsRefetch();
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
    <>
      <Head>
        <title>{`${props.title} - Tracktr.`}</title>
        <meta property="og:image" content={PosterImage({ path: props.poster, size: "lg" })} />
        <meta name="description" content={`Track ${props.title} and other movies & series with Tracktr.`} />
      </Head>

      <LoadingPageComponents status={status} notFound>
        {() => (
          <>
            <ContentBackdrop path={data.backdrop_path} />

            <ContentGrid>
              <ContentPoster
                showWatchlistButton
                title={data.title}
                poster={data.poster_path}
                id={data.id}
                theme_color={data.theme_color}
                refetchReviews={reviewsRefetch}
                userReview={
                  (reviews?.reviews || []).filter((e: any) => e.user_id === session.data?.user?.id).length > 0 &&
                  reviews?.reviews[0].content
                }
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
                  refetchReviews={refetch}
                  isRefetching={isRefetching}
                  themeColor={data.theme_color}
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
  const movieUrl = new URL(`movie/${context.query.movieID}`, process.env.NEXT_PUBLIC_TMDB_API);
  movieUrl.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");

  const movie = await fetch(movieUrl).then((res) => res.json());

  if (movie?.status_code) {
    throw new Error("Not Found");
  }

  return {
    props: {
      movieID: movie.id,
      title: movie.title,
      poster: movie.poster_path,
    },
  };
};

export default MovieReviewsPage;
