import { useRouter } from "next/router";
import LoadingPageComponents from "../../../../../components/common/LoadingPageComponents";
import CastBlock from "../../../../../components/pageBlocks/CastBlock";
import ContentHeader from "../../../../../components/pageBlocks/ContentHeader";
import EpisodesBlock from "../../../../../components/pageBlocks/EpisodesBlock";
import { trpc } from "../../../../../utils/trpc";

const TVPage = () => {
  const router = useRouter();
  const { tvID, seasonID } = router.query;

  const { data: tvShow } = trpc.tv.tvById.useQuery({
    tvID: tvID as string,
  });

  const { data, status, refetch, isRefetching } = trpc.season.seasonByID.useQuery(
    {
      tvID: tvID as string,
      seasonID: Number(seasonID),
    },
    { enabled: router.isReady }
  );

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <ContentHeader
          cover={tvShow.backdrop_path}
          poster={data.poster_path}
          title={data.name}
          description={data.overview}
          themeColor={tvShow.theme_color}
          seriesProgression={tvShow.number_of_episodes_watched}
          amountOfEpisodes={tvShow.number_of_episodes}
        >
          <EpisodesBlock episodes={data.episodes} refetch={refetch} fetchStatus={isRefetching} />
          <CastBlock cast={data.credits.cast} />
        </ContentHeader>
      )}
    </LoadingPageComponents>
  );
};

export default TVPage;
