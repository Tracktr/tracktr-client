import { useRouter } from "next/router";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import CastBlock from "../../components/pageBlocks/CastBlock";
import CrewBlock from "../../components/pageBlocks/CrewBlock";
import DetailsBlock from "../../components/pageBlocks/DetailsBlock";
import { trpc } from "../../utils/trpc";
import ContentBackdrop from "../../components/pageBlocks/ContentBackdrop";
import ContentPoster from "../../components/pageBlocks/ContentPoster";
import ContentOverview from "../../components/pageBlocks/ContentOverview";
import ContentTitle from "../../components/pageBlocks/ContentTitle";
import ContentGrid from "../../components/pageBlocks/ContentGrid";
import ContentMain from "../../components/pageBlocks/ContentMain";

const MoviePage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data, status } = trpc.movie.movieById.useQuery({ slug: slug ? slug[0] : undefined });

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <>
          <ContentBackdrop path={data.backdrop_path} />

          <ContentGrid>
            <ContentPoster
              showWatchlistButton
              showReviewButton
              title={data.title}
              poster={data.poster_path}
              id={data.id}
              theme_color={data.theme_color}
            />

            <ContentMain>
              <ContentTitle
                theme_color={data.theme_color}
                title={data.title}
                score={data.vote_average}
                air_date={data.release_date}
                genres={data.genres}
              />
              <ContentOverview
                name={data.name}
                overview={data.overview}
                theme_color={data.theme_color}
                videos={data.videos}
                justwatch={data["watch/providers"]}
              />

              <DetailsBlock
                budget={data.budget}
                releaseDate={data.release_date}
                revenue={data.revenue}
                runtime={data.runtime}
                status={data.status}
              />
              <CastBlock cast={data.credits.cast} />
              <CrewBlock crew={data.credits.crew} />
            </ContentMain>
          </ContentGrid>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default MoviePage;
