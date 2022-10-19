import { useRouter } from "next/router";
import LoadingPageComponents from "../../../../../../components/common/LoadingPageComponents";
import CastBlock from "../../../../../../components/pageBlocks/CastBlock";
import ContentHeader from "../../../../../../components/pageBlocks/ContentHeader";
import { trpc } from "../../../../../../utils/trpc";

const EpisodePage = () => {
  const router = useRouter();
  const { tvID, seasonID, episodeID } = router.query;

  const { data: tvShow } = trpc.tv.tvById.useQuery({
    tvID: tvID as string,
  });

  const { data: episodeData, status: episodeStatus } = trpc.episode.episodeById.useQuery({
    tvID: tvID as string,
    seasonID: seasonID as string,
    episodeID: episodeID ? episodeID[0] : undefined,
  });

  return (
    <LoadingPageComponents status={episodeStatus}>
      {() => (
        <ContentHeader
          cover={tvShow.backdrop_path}
          poster={tvShow.poster_path}
          title={episodeData.name}
          description={episodeData.overview}
          date={episodeData.air_date}
        >
          <CastBlock cast={episodeData.credits.cast} />
        </ContentHeader>
      )}
    </LoadingPageComponents>
  );
};

export default EpisodePage;