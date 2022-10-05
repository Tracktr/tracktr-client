import { GetStaticPaths, GetStaticProps } from "next";
import Error from "next/error";
import { dehydrate, QueryClient, useQuery } from "react-query";
import ContentHeader from "../../components/content/ContentHeader";
import { fetchDetailedContent } from "../../utils/fetchQueries";

interface IMovieContent {
  backdrop_path: string;
  poster_path: string;
  title: string;
  release_date: string;
  overview: string;
}

const MoviePage = ({ props }: any) => {
  const { data, isSuccess } = useQuery<IMovieContent, Error>(["getContent", props.id], {
    staleTime: 24 * (60 * (60 * 1000)),
  });

  return (
    isSuccess && (
      <ContentHeader
        cover={data.backdrop_path}
        poster={data.poster_path}
        title={data.title}
        date={data.release_date}
        description={data.overview}
      />
    )
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.slug as string;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["getContent", id], () =>
    fetchDetailedContent({
      type: "Movie",
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

export default MoviePage;
