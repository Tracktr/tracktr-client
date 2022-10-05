import { GetStaticPaths, GetStaticProps } from "next";
import Error from "next/error";
import { dehydrate, QueryClient, useQuery } from "react-query";
import ContentHeader from "../../components/content/ContentHeader";
import { fetchDetailedContent } from "../../utils/fetchQueries";

interface ITVContent {
  backdrop_path: string;
  poster_path: string;
  name: string;
  release_date: string;
  overview: string;
}

const TVPage = () => {
  const { data, isSuccess } = useQuery<ITVContent, Error>(["getContent"], { staleTime: 24 * (60 * (60 * 1000)) });

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
  const id = context.params?.slug as string;

  const queryClient = new QueryClient();

  queryClient.invalidateQueries(["getContent"]);
  await queryClient.prefetchQuery(["getContent"], () =>
    fetchDetailedContent({
      type: "TV",
      id,
    })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default TVPage;
