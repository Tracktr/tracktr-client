import ContentHeader from "@/components/content/ContentHeader";
import CastBlock from "@/components/PageBlocks/CastBlock";
import { fetchMovieContent } from "@/utils/fetchQueries";
import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import LoadingPageComponents from "../../components/common/loading/LoadingPageComponents";

const MoviePage = ({ props }: any) => {
  const { data, status } = useQuery(["movie", props.id], () => fetchMovieContent(props.id));
  const { data: session } = useSession();
  console.log(session);
  return (
    <LoadingPageComponents status={status}>
      {() => (
        <ContentHeader
          cover={data.backdrop_path}
          poster={data.poster_path}
          title={data.title}
          date={data.release_date}
          description={data.overview}
        >
          <CastBlock cast={data.credits.cast} />
        </ContentHeader>
      )}
    </LoadingPageComponents>
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
