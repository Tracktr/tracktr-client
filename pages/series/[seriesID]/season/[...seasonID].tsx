import { GetStaticPaths, GetStaticProps } from "next";
import Error from "next/error";
import { dehydrate, QueryClient, useQuery } from "react-query";
import ContentHeader from "../../../../components/content/ContentHeader";
import { fetchSeasonContent } from "../../../../utils/fetchQueries";

interface ITVContent {
  backdrop_path: string;
  poster_path: string;
  name: string;
  release_date: string;
  overview: string;
  seasons: any;
}

const TVPage = ({ props }: any) => {
  const { data, isSuccess } = useQuery<ITVContent, Error>(["getSeasonContent", props.seasonID], {
    staleTime: 24 * (60 * (60 * 1000)),
  });

  return (
    isSuccess && (
      <ContentHeader
        cover={data.backdrop_path}
        poster={data.poster_path}
        title={data.name}
        description={data.overview}
      />
    )
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const seriesID = context.params?.seriesID as string;
  const seasonID = context.params?.seasonID as string;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["getSeasonContent", seasonID[0]], () =>
    fetchSeasonContent({
      seriesID,
      seasonID: seasonID[0],
    })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
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
