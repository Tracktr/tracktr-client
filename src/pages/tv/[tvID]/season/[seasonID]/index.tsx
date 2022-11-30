import { useRouter } from "next/router";
import LoadingPageComponents from "../../../../../components/common/LoadingPageComponents";
import CastBlock from "../../../../../components/pageBlocks/CastBlock";
import ContentHeader from "../../../../../components/pageBlocks/ContentHeader";
import EpisodesBlock from "../../../../../components/pageBlocks/EpisodesBlock";
import { trpc } from "../../../../../utils/trpc";

const TVPage = () => {
  const router = useRouter();
  const { tvID, seasonID } = router.query;

  const { data: tvShow, refetch: tvRefetch } = trpc.tv.tvById.useQuery(
    {
      tvID: tvID as string,
    },
    { enabled: router.isReady }
  );

  const {
    data,
    status,
    refetch: seasonRefetch,
    isRefetching,
  } = trpc.season.seasonByID.useQuery(
    {
      tvID: tvID as string,
      seasonID: Number(seasonID),
    },
    { enabled: router.isReady }
  );

  //TODO: merge these trpc request to one
  const refetch = () => {
    tvRefetch();
    seasonRefetch();
  };

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <ContentHeader
          cover={tvShow.backdrop_path}
          poster={data.poster_path}
          title={data.name}
          description={data.overview}
          justWatch={tvShow["watch/providers"]}
          themeColor={tvShow.theme_color}
          seriesProgression={tvShow.number_of_episodes_watched}
          amountOfEpisodes={tvShow.number_of_episodes}
          videos={tvShow.videos}
        >
          <EpisodesBlock
            episodes={data.episodes}
            refetch={refetch}
            fetchStatus={isRefetching}
            themeColor={tvShow.theme_color}
          />
          <CastBlock cast={data.credits.cast} />
        </ContentHeader>
      )}
    </LoadingPageComponents>
  );
};

export default TVPage;
