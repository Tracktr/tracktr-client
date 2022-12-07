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

const EpisodePage = () => {
  const router = useRouter();
  const { tvID, seasonNumber, episodeNumber } = router.query;

  const { data: tvShow, refetch } = trpc.tv.tvById.useQuery(
    {
      tvID: tvID as string,
    },
    { enabled: router.isReady }
  );

  const {
    data: episodeData,
    status: episodeStatus,
    refetch: episodeRefetch,
    isRefetching,
  } = trpc.episode.episodeById.useQuery(
    {
      tvID: tvID as string,
      seasonID: seasonNumber as string,
      episodeNumber: episodeNumber as string,
    },
    { enabled: router.isReady }
  );

  return (
    <LoadingPageComponents status={episodeStatus}>
      {() => (
        <>
          <Head>
            <title>
              {tvShow.name} {episodeData.season_number}x{episodeData.episode_number} - {episodeData.name} - Tracktr.
            </title>
          </Head>

          <ContentBackdrop path={tvShow.backdrop_path} />

          <ContentGrid>
            {/* <ContentPoster
              title={episodeData.name}
              poster={tvShow.poster_path}
              id={Number(tvID)}
              theme_color={tvShow.theme_color}
              progression={{
                number_of_episodes: tvShow.number_of_episodes,
                number_of_episodes_watched: tvShow.number_of_episodes_watched,
              }}
              episode={{
                episodeNumber: Number(episodeNumber),
                episodeID: Number(episodeData.id),
                refetch,
                seasonID: Number(seasonID),
              }}
              refetchReviews={episodeRefetch}
            /> */}

            <ContentMain>
              <ContentTitle
                theme_color={tvShow.theme_color}
                title={episodeData.name}
                score={episodeData.vote_average}
                air_date={episodeData.air_date}
                episode={{
                  season_number: episodeData.season_number,
                  episode_number: episodeData.episode_number,
                }}
              />
              <ContentOverview
                name={episodeData.name}
                overview={episodeData.overview}
                theme_color={tvShow.theme_color}
                videos={tvShow.videos}
                justwatch={tvShow["watch/providers"]}
              />

              <CastBlock cast={episodeData.credits.cast} />
              <CrewBlock crew={episodeData.credits.crew} />
              <ReviewsBlock reviews={episodeData.reviews} refetchReviews={episodeRefetch} isRefetching={isRefetching} />
              <EpisodeSwitcherBlock seasons={tvShow.seasons} />
            </ContentMain>
          </ContentGrid>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default EpisodePage;
