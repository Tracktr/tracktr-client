import LoadingPageComponents from "../../../../../../../components/common/LoadingPageComponents";
import { trpc } from "../../../../../../../utils/trpc";
import ContentBackdrop from "../../../../../../../components/pageBlocks/ContentBackdrop";
import ContentPoster from "../../../../../../../components/pageBlocks/ContentPoster";
import ContentTitle from "../../../../../../../components/pageBlocks/ContentTitle";
import ContentGrid from "../../../../../../../components/pageBlocks/ContentGrid";
import ContentMain from "../../../../../../../components/pageBlocks/ContentMain";
import ReviewsBlock from "../../../../../../../components/pageBlocks/ReviewsBlock";
import Head from "next/head";
import { PosterImage } from "../../../../../../../utils/generateImages";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const EpisodeReviewsPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const session = useSession();
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data: seriesData, refetch: seriesRefetch } = trpc.tv.seriesById.useQuery({
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

  const { data: reviews, refetch: reviewsRefetch } = trpc.review.getReviews.useQuery(
    {
      episodeID: Number(episodeData?.id),
      page,
      pageSize: 25,
      linkedReview: router.query.review && String(router.query.review),
    },
    { enabled: router.isReady }
  );

  const refetch = () => {
    episodeRefetch();
    seriesRefetch();
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
        <title>
          {`Reviews for ${props.seriesName} ${props.seasonNumber}x${props.episodeNumber} - ${props.episodeName} - Tracktr.`}
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
                <ReviewsBlock
                  reviewPage
                  reviews={reviews?.reviews || []}
                  refetchReviews={refetch}
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

export default EpisodeReviewsPage;
