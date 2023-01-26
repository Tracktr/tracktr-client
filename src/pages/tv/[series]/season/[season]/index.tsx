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
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../../../../server/trpc/router/_app";
import { createContext } from "../../../../../server/trpc/context";
import SuperJSON from "superjson";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import SeenByBlock from "../../../../../components/pageBlocks/SeenByBlock";

const TVPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
    { id: Number(seasonData.id) },
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

  const refetch = () => {
    seriesRefetch();
    seasonRefetch();
    watchHistory.refetch();
  };

  return (
    <LoadingPageComponents status={seasonStatus} notFound>
      {() => (
        <>
          <Head>
            <title>{`${seriesData.name} ${seasonData.name} - Tracktr.`}</title>
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
              <SeenByBlock data={seenBy} />
              <CastBlock cast={seasonData.credits.cast} />
              <CrewBlock crew={seasonData.credits.crew} />
              <ReviewsBlock
                reviews={seasonData.reviews}
                refetchReviews={seasonRefetch}
                isRefetching={seasonIsRefetching}
              />
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

export default TVPage;
