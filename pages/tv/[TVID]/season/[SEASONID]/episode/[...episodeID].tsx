import LoadingPageComponents from "@/components/common/loading/LoadingPageComponents";
import ContentHeader from "@/components/content/ContentHeader";
import { fetchEpisodeContent, fetchTVContent } from "@/utils/fetchQueries";
import { GetStaticPaths, GetStaticProps } from "next";
import { useQuery } from "react-query";

const EpisodePage = ({ props }: any) => {
  const { data: episodeData, status: episodeStatus } = useQuery(
    ["TV_Season", `${props.seriesID}-${props.seasonID}-${props.episodeID}`],
    () =>
      fetchEpisodeContent({
        seriesID: props.seriesID,
        seasonID: props.seasonID,
        episodeID: props.episodeID,
      })
  );

  const { data: tvID } = useQuery(["TV", `${props.seriesID}`], () =>
    fetchTVContent({
      seriesID: props.seriesID,
    })
  );

  return (
    <LoadingPageComponents status={episodeStatus}>
      {() => (
        <ContentHeader
          cover={tvID.backdrop_path}
          poster={tvID.poster_path}
          title={episodeData.name}
          description={episodeData.overview}
          date={episodeData.air_date}
        />
      )}
    </LoadingPageComponents>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const seriesID = context.params?.TVID as string;
  const seasonID = context.params?.SEASONID as string;
  const episodeID = context.params?.episodeID as string;

  return {
    props: {
      props: {
        seriesID,
        seasonID,
        episodeID: episodeID[0],
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default EpisodePage;
