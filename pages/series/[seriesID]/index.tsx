import { GetStaticPaths, GetStaticProps } from "next";
import Error from "next/error";
import { dehydrate, QueryClient, useQuery } from "react-query";
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
  const { data, isSuccess } = useQuery<ITVContent, Error>(["getSeriesContent", props.id], {
    staleTime: 24 * (60 * (60 * 1000)),
  });

  return (
    isSuccess && (
      <ContentHeader cover={data.backdrop_path} poster={data.poster_path} title={data.name} description={data.overview}>
        <SeasonsBlock seasons={data.seasons} seriesID={props.id} />
      </ContentHeader>
    )
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.seriesID as string;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["getSeriesContent", id], () =>
    fetchDetailedContent({
      type: "TV",
      id,
    })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
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
