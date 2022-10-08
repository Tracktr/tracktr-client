import { GetStaticPaths, GetStaticProps } from "next";
import { useQuery } from "react-query";
import ContentHeader from "../../components/content/ContentHeader";
import { fetchDetailedContent } from "../../utils/fetchQueries";

const MoviePage = ({ props }: any) => {
  const { data, isSuccess } = useQuery(["movie"], () =>
    fetchDetailedContent({
      id: props.id,
      type: "Movie",
    })
  );

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

  return {
    props: {
      props: {
        id: id[0],
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default MoviePage;
