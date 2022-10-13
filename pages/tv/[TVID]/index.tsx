import ContentHeader from "@/components/content/ContentHeader";
import CastBlock from "@/components/PageBlocks/CastBlock";
import SeasonsBlock from "@/components/PageBlocks/SeasonsBlock";
import { fetchTVContent } from "@/utils/fetchQueries";
import { GetStaticPaths, GetStaticProps } from "next";
import { useQuery } from "react-query";
import LoadingPageComponents from "../../../components/common/loading/LoadingPageComponents";

const TVPage = ({ props }: any) => {
  const { data, status } = useQuery(["TV", props.id], () =>
    fetchTVContent({
      seriesID: props.id,
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
          <SeasonsBlock seasons={data.seasons} seriesID={props.id} />
          <CastBlock cast={data.credits.cast} />
        </ContentHeader>
      )}
    </LoadingPageComponents>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.TVID as string;

  return {
    props: {
      props: {
        id,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default TVPage;
