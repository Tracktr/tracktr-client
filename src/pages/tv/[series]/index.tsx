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
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../../server/trpc/router/_app";
import { createContext } from "../../../server/trpc/context";
import SuperJSON from "superjson";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import SeenByBlock from "../../../components/pageBlocks/SeenByBlock";

const TVPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const session = useSession();

  const {
    data: seriesData,
    status,
    refetch,
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

  const { data: seenBy } = trpc.tv.seenBy.useQuery(
    { id: Number(props.seriesID) },
    { enabled: status === "success" }
  );

  return (
    <LoadingPageComponents status={status} notFound>
      {() => (
        <>
          <Head>
            <title>{`${seriesData.name} - Tracktr.`}</title>
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
              <SeenByBlock data={seenBy} />
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

export default TVPage;
