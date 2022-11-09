import { useRouter } from "next/router";
import LoadingPageComponents from "../../../components/common/LoadingPageComponents";
import CastBlock from "../../../components/pageBlocks/CastBlock";
import ContentHeader from "../../../components/pageBlocks/ContentHeader";
import DetailsBlock from "../../../components/pageBlocks/DetailsBlock";
import SeasonsBlock from "../../../components/pageBlocks/SeasonsBlock";
import { trpc } from "../../../utils/trpc";

const TVPage = () => {
  const router = useRouter();
  const { tvID } = router.query;

  const { data, status } = trpc.tv.tvById.useQuery({ tvID: tvID as string });

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <ContentHeader
          cover={data.backdrop_path}
          poster={data.poster_path}
          title={data.name}
          description={data.overview}
          genres={data.genres}
          score={data.vote_average}
        >
          <DetailsBlock
            status={data.status}
            numberOfEpisodes={data.number_of_episodes}
            numberOfSeasons={data.number_of_seasons}
          />
          <SeasonsBlock seasons={data.seasons} />
          <CastBlock cast={data.credits.cast} />
        </ContentHeader>
      )}
    </LoadingPageComponents>
  );
};

export default TVPage;
