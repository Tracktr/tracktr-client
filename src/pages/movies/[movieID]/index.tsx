import LoadingPageComponents from "../../../components/common/LoadingPageComponents";
import CastBlock from "../../../components/pageBlocks/CastBlock";
import CrewBlock from "../../../components/pageBlocks/CrewBlock";
import DetailsBlock from "../../../components/pageBlocks/DetailsBlock";
import { trpc } from "../../../utils/trpc";
import ContentBackdrop from "../../../components/pageBlocks/ContentBackdrop";
import ContentPoster from "../../../components/pageBlocks/ContentPoster";
import ContentOverview from "../../../components/pageBlocks/ContentOverview";
import ContentTitle from "../../../components/pageBlocks/ContentTitle";
import ContentGrid from "../../../components/pageBlocks/ContentGrid";
import ContentMain from "../../../components/pageBlocks/ContentMain";
import ReviewsBlock from "../../../components/pageBlocks/ReviewsBlock";
import Head from "next/head";
import RecommendationsBlock from "../../../components/pageBlocks/RecommendationsBlock";
import { PosterImage } from "../../../utils/generateImages";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../../server/trpc/router/_app";
import { createContext } from "../../../server/trpc/context";
import SuperJSON from "superjson";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import SeenByBlock from "../../../components/pageBlocks/SeenByBlock";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const MoviePage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const session = useSession();
  const router = useRouter();
  const { data, status } = trpc.movie.movieById.useQuery({ slug: props.movieID });
  const { data: seenBy } = trpc.movie.seenBy.useQuery({ id: Number(props.movieID) });
  const {
    data: reviews,
    refetch: reviewsRefetch,
    isRefetching: isRefetchingReviews,
  } = trpc.review.getReviews.useQuery(
    {
      movieID: Number(props.movieID),
      page: 1,
      pageSize: 3,
      linkedReview: router.query.review && String(router.query.review),
    },
    { enabled: router.isReady }
  );

  return (
    <LoadingPageComponents status={status} notFound>
      {() => (
        <>
          <Head>
            <title>{`${data.title} - Tracktr.`}</title>
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
              <ContentOverview
                name={data.title}
                overview={data.overview}
                theme_color={data.theme_color}
                videos={data.videos}
                justwatch={data["watch/providers"]}
              />

              <DetailsBlock
                budget={data.budget}
                releaseDate={data.release_date}
                revenue={data.revenue}
                runtime={data.runtime}
                status={data.status}
              />
              {session.status === "authenticated" ? <SeenByBlock data={seenBy} /> : <></>}
              <CastBlock cast={data.credits.cast} />
              <CrewBlock crew={data.credits.crew} />
              <ReviewsBlock
                reviews={reviews?.reviews || []}
                refetchReviews={reviewsRefetch}
                isRefetching={isRefetchingReviews}
                themeColor={data.theme_color}
                linkedReview={reviews?.linkedReview}
              />
            </ContentMain>
          </ContentGrid>
          <RecommendationsBlock type="movies" recommendations={data.recommendations} />
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

export default MoviePage;
