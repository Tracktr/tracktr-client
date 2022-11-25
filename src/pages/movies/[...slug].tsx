import { useRouter } from "next/router";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import CastBlock from "../../components/pageBlocks/CastBlock";
import ContentHeader from "../../components/pageBlocks/ContentHeader";
import DetailsBlock from "../../components/pageBlocks/DetailsBlock";
import { trpc } from "../../utils/trpc";

const MoviePage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data, status } = trpc.movie.movieById.useQuery({ slug: slug ? slug[0] : undefined });

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <ContentHeader
          watchButton={{
            itemID: data.id,
          }}
          genres={data.genres}
          cover={data.backdrop_path}
          poster={data.poster_path}
          title={data.title}
          date={data.release_date}
          description={data.overview}
          score={data.vote_average}
          justWatch={data["watch/providers"]}
          themeColor={data.theme_color}
          videos={data.videos}
          movieID={data.id}
        >
          <DetailsBlock
            budget={data.budget}
            releaseDate={data.release_date}
            revenue={data.revenue}
            runtime={data.runtime}
            status={data.status}
          />
          <CastBlock cast={data.credits.cast} />
        </ContentHeader>
      )}
    </LoadingPageComponents>
  );
};

export default MoviePage;
