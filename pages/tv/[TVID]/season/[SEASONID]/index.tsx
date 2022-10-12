import LoadingPageComponents from "@/components/common/loading/LoadingPageComponents";
import ContentHeader from "@/components/content/ContentHeader";
import EpisodesBlock from "@/components/TV/EpisodesBlock";
import { fetchSeasonContent } from "@/utils/fetchQueries";
import { GetStaticPaths, GetStaticProps } from "next";
import { useQuery } from "react-query";

const TVPage = ({ props }: any) => {
  const { data, status } = useQuery(["TV_Season", `${props.seriesID}-${props.seasonID}`], () =>
    fetchSeasonContent({
      seriesID: props.seriesID,
      seasonID: props.seasonID,
    })
  );

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <ContentHeader
          cover={data.backdrop_path}
          poster={data.poster_path}
          title={data.name}
          description={data.overview}
        >
          <EpisodesBlock episodes={data.episodes} seriesID={props.seriesID} />
        </ContentHeader>
      )}
    </LoadingPageComponents>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const seriesID = context.params?.TVID as string;
  const seasonID = context.params?.SEASONID as string;

  return {
    props: {
      props: {
        seriesID,
        seasonID: seasonID[0],
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default TVPage;
