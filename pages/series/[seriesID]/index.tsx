import { GetStaticPaths, GetStaticProps } from "next";
import Error from "next/error";
import { dehydrate, QueryClient, useQuery } from "react-query";
import LoadingPageComponents from "../../../components/common/loading/LoadingPageComponents";
import ContentHeader from "../../../components/content/ContentHeader";
import SeasonsBlock from "../../../components/TV/SeasonsBlock";
import { fetchDetailedContent } from "../../../utils/fetchQueries";

interface ITVContent {
  backdrop_path: string;
  poster_path: string;
  name: string;
  release_date: string;
  overview: string;
  seasons: any;
}

const TVPage = ({ props }: any) => {
  const { data, status } = useQuery(["Series", props.id], () =>
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
  const id = context.params?.seriesID as string;

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
