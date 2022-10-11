import ContentHeader from "@/components/content/ContentHeader";
import SeasonsBlock from "@/components/TV/SeasonsBlock";
import { fetchDetailedContent } from "@/utils/fetchQueries";
import { GetStaticPaths, GetStaticProps } from "next";
import { useQuery } from "react-query";
import LoadingPageComponents from "../../../components/common/loading/LoadingPageComponents";

const TVPage = ({ props }: any) => {
  const { data, status } = useQuery(["TV", props.id], () =>
    fetchDetailedContent({
      id: props.id,
      type: "TV",
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
