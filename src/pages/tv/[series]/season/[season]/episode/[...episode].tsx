import { useRouter } from "next/router";
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

const EpisodePage = () => {
  const router = useRouter();
  const { series: seriesID, season: seasonNumber, episode: episodeNumber } = router.query;

  const { data: seriesData, refetch } = trpc.tv.seriesById.useQuery(
    {
      seriesID: Number(seriesID),
    },
    { enabled: router.isReady }
  );

  const {
    data: episodeData,
    status: episodeStatus,
    refetch: episodeRefetch,
    isRefetching,
  } = trpc.episode.episodeByID.useQuery(
    {
      seriesID: Number(seriesID),
      seasonNumber: Number(seasonNumber),
      episodeNumber: Number(episodeNumber),
    },
    { enabled: router.isReady }
  );

  return (
    <LoadingPageComponents status={episodeStatus} notFound>
      {() => (
        <>
          <Head>
            <title>
              {seriesData.name} {episodeData.season_number}x{episodeData.episode_number} - {episodeData.name} - Tracktr.
            </title>
          </Head>

          <ContentBackdrop path={seriesData.backdrop_path} />

          <ContentGrid>
            <ContentPoster
              title={episodeData.name}
              poster={seriesData.poster_path}
              id={Number(seriesID)}
              theme_color={seriesData.theme_color}
              progression={{
                number_of_episodes: seriesData.number_of_episodes,
                number_of_episodes_watched: seriesData.number_of_episodes_watched,
              }}
              episode={{
                seasonNumber: Number(seasonNumber),
                episodeNumber: Number(episodeNumber),
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
                  base_url: `/tv/${seriesID}`,
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

export default EpisodePage;
