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
import ReviewsBlock from "../../components/pageBlocks/ReviewsBlock";
import Head from "next/head";
import RecommendationsBlock from "../../components/pageBlocks/RecommendationsBlock";
import { PosterImage } from "../../utils/generateImages";

const MoviePage = () => {
  const router = useRouter();
  const { data, status, refetch, isRefetching } = trpc.movie.movieById.useQuery(
    { slug: String(router.query?.movieID) },
    { enabled: router.isReady }
  );

  return (
    <LoadingPageComponents status={status} notFound>
      {() => (
        <>
          <Head>
            <title>{data.title} - Tracktr.</title>
            <meta property="og:image" content={PosterImage({ path: data.poster_path, size: "lg" })} />
            <meta name="description" content={`Track ${data.title} and other movies & series with Tracktr.`} />
          </Head>

          <ContentBackdrop path={data.backdrop_path} />

          <ContentGrid>
            <ContentPoster
              showWatchlistButton
              title={data.title}
              poster={data.poster_path}
              id={data.id}
              theme_color={data.theme_color}
              refetchReviews={refetch}
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
              <ReviewsBlock reviews={data.reviews} refetchReviews={refetch} isRefetching={isRefetching} />
            </ContentMain>
          </ContentGrid>
          <RecommendationsBlock type="movies" recommendations={data.recommendations} />
        </>
      )}
    </LoadingPageComponents>
  );
};

export default MoviePage;
