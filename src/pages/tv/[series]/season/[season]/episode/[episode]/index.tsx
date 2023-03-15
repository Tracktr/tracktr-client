import LoadingPageComponents from "../../../../../../../components/common/LoadingPageComponents";
import CastBlock from "../../../../../../../components/pageBlocks/CastBlock";
import CrewBlock from "../../../../../../../components/pageBlocks/CrewBlock";
import EpisodeSwitcherBlock from "../../../../../../../components/pageBlocks/EpisodeSwitcherBlock";
import { trpc } from "../../../../../../../utils/trpc";
import ContentBackdrop from "../../../../../../../components/pageBlocks/ContentBackdrop";
import ContentPoster from "../../../../../../../components/pageBlocks/ContentPoster";
import ContentOverview from "../../../../../../../components/pageBlocks/ContentOverview";
import ContentTitle from "../../../../../../../components/pageBlocks/ContentTitle";
import ContentGrid from "../../../../../../../components/pageBlocks/ContentGrid";
import ContentMain from "../../../../../../../components/pageBlocks/ContentMain";
import ReviewsBlock from "../../../../../../../components/pageBlocks/ReviewsBlock";
import Head from "next/head";
import DetailsBlock from "../../../../../../../components/pageBlocks/DetailsBlock";
import { PosterImage } from "../../../../../../../utils/generateImages";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import SeenByBlock from "../../../../../../../components/pageBlocks/SeenByBlock";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const EpisodePage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const session = useSession();
  const { data: seriesData, refetch: seriesRefetch } = trpc.tv.seriesById.useQuery({
    seriesID: Number(props.seriesID),
  });

  const {
    data: episodeData,
    status: episodeStatus,
    refetch: episodeRefetch,
  } = trpc.episode.episodeByID.useQuery({
    seriesID: Number(props.seriesID),
    seasonNumber: Number(props.seasonNumber),
    episodeNumber: Number(props.episodeNumber),
  });

  const {
    data: reviews,
    refetch: reviewsRefetch,
    isRefetching: isRefetchingReviews,
  } = trpc.review.getReviews.useQuery(
    {
      episodeID: episodeData?.id,
      page: 1,
      pageSize: 3,
      linkedReview: router.query.review && String(router.query.review),
    },
    { enabled: router.isReady && Boolean(episodeData?.id) }
  );

  const { data: seenBy } = trpc.episode.seenBy.useQuery(
    { id: Number(episodeData?.id) },
    { enabled: episodeStatus === "success" && session.status === "authenticated" }
  );

  const refetch = () => {
    seriesRefetch();
    episodeRefetch();
  };

  return (
    <>
      <Head>
        <title>
          {`${props.seriesName} ${props.seasonNumber}x${props.episodeNumber} - ${props.episodeName} - Tracktr.`}
        </title>
        <meta property="og:image" content={PosterImage({ path: props.episodePoster, size: "md" })} />
        <meta
          name="description"
          content={`Track ${props.seriesName} Season ${props.seasonNumber}, Episode ${props.episodeName} - ${props.episodeName} and other series & movies with Tracktr.`}
        />
      </Head>
      <LoadingPageComponents status={episodeStatus} notFound>
        {() => (
          <>
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
                refetchReviews={reviewsRefetch}
                userReview={
                  (reviews?.reviews || []).filter((e: any) => e.user_id === session.data?.user?.id).length > 0 &&
                  reviews?.reviews[0].content
                }
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
                <CastBlock cast={episodeData.credits.cast} guestStars={episodeData.guest_stars} />
                <CrewBlock crew={episodeData.credits.crew} />
                <ReviewsBlock
                  reviews={reviews?.reviews || []}
                  refetchReviews={reviewsRefetch}
                  isRefetching={isRefetchingReviews}
                  themeColor={episodeData.theme_color}
                  linkedReview={reviews?.linkedReview}
                />
                <EpisodeSwitcherBlock seasons={seriesData.seasons || []} />
              </ContentMain>
            </ContentGrid>
          </>
        )}
      </LoadingPageComponents>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const seasonEpisode = `season/${context.query.season}/episode/${context.query.episode}`;

  const seriesUrl = new URL(`tv/${Number(context.query.series)}`, process.env.NEXT_PUBLIC_TMDB_API);
  seriesUrl.searchParams.append("api_key", process.env.NEXT_PUBLIC_TMDB_KEY || "");
  seriesUrl.searchParams.append("append_to_response", seasonEpisode);

  const series = await fetch(seriesUrl).then((res) => res.json());

  if (series?.status_code) {
    throw new Error("Not Found");
  }

  const season = series.seasons.filter((s: any) => s.season_number === Number(context.query.season));
  const episode = series[seasonEpisode];

  return {
    props: {
      seriesID: series.id,
      seriesName: series.name,
      seasonNumber: season[0].season_number,
      episodeNumber: episode.episode_number,
      episodePoster: episode.still_path,
      episodeName: episode.name,
    },
  };
};

export default EpisodePage;
