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

const EpisodePage = () => {
  const router = useRouter();
  const { tvID, seasonID, episodeID } = router.query;

  const { data: tvShow, refetch } = trpc.tv.tvById.useQuery(
    {
      tvID: tvID as string,
    },
    { enabled: router.isReady }
  );

  const { data: episodeData, status: episodeStatus } = trpc.episode.episodeById.useQuery(
    {
      tvID: tvID as string,
      seasonID: seasonID as string,
      episodeID: episodeID ? episodeID[0] : undefined,
    },
    { enabled: router.isReady }
  );

  return (
    <LoadingPageComponents status={episodeStatus}>
      {() => (
        <>
          <ContentBackdrop path={tvShow.backdrop_path} />

          <ContentGrid>
            <ContentPoster
              title={episodeData.name}
              poster={tvShow.poster_path}
              id={Number(tvID)}
              theme_color={tvShow.theme_color}
              progression={{
                number_of_episodes: tvShow.number_of_episodes,
                number_of_episodes_watched: tvShow.number_of_episodes_watched,
              }}
              episode={{
                episodeID: Number(episodeID),
                refetch: refetch,
                seasonID: Number(seasonID),
              }}
            />

            <div className="col-span-3 px-4">
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
              <EpisodeSwitcherBlock seasons={tvShow.seasons} />
            </div>
          </ContentGrid>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default EpisodePage;
