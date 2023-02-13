import LoadingPageComponents from "../../../../../../components/common/LoadingPageComponents";
import CastBlock from "../../../../../../components/pageBlocks/CastBlock";
import CrewBlock from "../../../../../../components/pageBlocks/CrewBlock";
import EpisodeSwitcherBlock from "../../../../../../components/pageBlocks/EpisodeSwitcherBlock";
import { trpc } from "../../../../../../utils/trpc";
import ContentBackdrop from "../../../../../../components/pageBlocks/ContentBackdrop";
import ContentPoster from "../../../../../../components/pageBlocks/ContentPoster";
import ContentOverview from "../../../../../../components/pageBlocks/ContentOverview";
import ContentTitle from "../../../../../../components/pageBlocks/ContentTitle";
import ContentGrid from "../../../../../../components/pageBlocks/ContentGrid";
import ContentMain from "../../../../../../components/pageBlocks/ContentMain";
import ReviewsBlock from "../../../../../../components/pageBlocks/ReviewsBlock";
import Head from "next/head";
import DetailsBlock from "../../../../../../components/pageBlocks/DetailsBlock";
import { PosterImage } from "../../../../../../utils/generateImages";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../../../../../server/trpc/router/_app";
import { createContext } from "../../../../../../server/trpc/context";
import SuperJSON from "superjson";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import SeenByBlock from "../../../../../../components/pageBlocks/SeenByBlock";
import { useSession } from "next-auth/react";

const EpisodePage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const session = useSession();
  const { data: seriesData, refetch } = trpc.tv.seriesById.useQuery({
    seriesID: Number(props.seriesID),
  });

  const {
    data: episodeData,
    status: episodeStatus,
    refetch: episodeRefetch,
    isRefetching,
  } = trpc.episode.episodeByID.useQuery({
    seriesID: Number(props.seriesID),
    seasonNumber: Number(props.seasonNumber),
    episodeNumber: Number(props.episodeNumber),
  });

  const { data: seenBy } = trpc.episode.seenBy.useQuery(
    { id: Number(episodeData.id) },
    { enabled: episodeStatus === "success" }
  );

  return (
    <LoadingPageComponents status={episodeStatus} notFound>
      {() => (
        <>
          <Head>
            <title>
              {`${seriesData.name} ${episodeData.season_number}x${episodeData.episode_number} - ${episodeData.name} - Tracktr.`}
            </title>
            <meta property="og:image" content={PosterImage({ path: seriesData.poster_path, size: "lg" })} />
            <meta
              name="description"
              content={`Track ${seriesData.name} Season ${episodeData.season_number}, Episode ${episodeData.episode_number} - ${episodeData.name} and other series & movies with Tracktr.`}
            />
          </Head>

          <ContentBackdrop path={seriesData.backdrop_path} />

          <ContentGrid>
            <ContentPoster
              title={episodeData.name}
              poster={seriesData.poster_path}
              id={Number(props.seriesID)}
              theme_color={seriesData.theme_color}
              progression={{
                number_of_episodes: seriesData.number_of_episodes,
                number_of_episodes_watched: seriesData.number_of_episodes_watched,
              }}
              episode={{
                seasonNumber: Number(props.seasonNumber),
                episodeNumber: Number(props.episodeNumber),
                episodeID: Number(episodeData.id),
                refetch,
              }}
              refetchReviews={episodeRefetch}
            />

            <ContentMain>
              <ContentTitle
                theme_color={seriesData.theme_color}
                title={episodeData.name}
                score={episodeData.vote_average}
                air_date={episodeData.air_date}
                episode={{
                  base_url: `/tv/${props.seriesID}`,
                  season_number: episodeData.season_number,
                  episode_number: episodeData.episode_number,
                }}
              />
              <ContentOverview
                name={episodeData.name}
                overview={episodeData.overview}
                theme_color={seriesData.theme_color}
                videos={seriesData.videos}
                justwatch={seriesData["watch/providers"]}
              />

              <DetailsBlock releaseDate={episodeData.air_date} runtime={episodeData.runtime} />
              {session.status === "authenticated" ? <SeenByBlock data={seenBy} /> : <></>}
              <CastBlock cast={episodeData.credits.cast} />
              <CrewBlock crew={episodeData.credits.crew} />
              <ReviewsBlock reviews={episodeData.reviews} refetchReviews={episodeRefetch} isRefetching={isRefetching} />
              <EpisodeSwitcherBlock seasons={seriesData.seasons} />
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
  await ssg.episode.episodeByID.prefetch({
    seriesID: Number(context.query.series),
    seasonNumber: Number(context.query.season),
    episodeNumber: Number(context.query.episode),
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      seriesID: context.query.series,
      seasonNumber: context.query.season,
      episodeNumber: context.query.episode,
    },
  };
};

export default EpisodePage;
