import { useRouter } from "next/router";
import LoadingPageComponents from "../../../components/common/LoadingPageComponents";
import ContentBackdrop from "../../../components/pageBlocks/ContentBackdrop";
import CastBlock from "../../../components/pageBlocks/CastBlock";
import CrewBlock from "../../../components/pageBlocks/CrewBlock";
import DetailsBlock from "../../../components/pageBlocks/DetailsBlock";
import PosterButton from "../../../components/pageBlocks/ContentPoster";
import SeasonsBlock from "../../../components/pageBlocks/SeasonsBlock";
import { trpc } from "../../../utils/trpc";
import ContentOverview from "../../../components/pageBlocks/ContentOverview";
import ContentTitle from "../../../components/pageBlocks/ContentTitle";
import ContentGrid from "../../../components/pageBlocks/ContentGrid";
import ContentMain from "../../../components/pageBlocks/ContentMain";
import ReviewsBlock from "../../../components/pageBlocks/ReviewsBlock";

const TVPage = () => {
  const router = useRouter();
  const { tvID } = router.query;

  const { data, status, refetch } = trpc.tv.tvById.useQuery({ tvID: tvID as string }, { enabled: router.isReady });

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <>
          <ContentBackdrop path={data.backdrop_path} />

          <ContentGrid>
            <PosterButton
              hideWatchButton
              showWatchlistButton
              title={data.title}
              poster={data.poster_path}
              id={data.id}
              theme_color={data.theme_color}
              progression={{
                number_of_episodes: data.number_of_episodes,
                number_of_episodes_watched: data.number_of_episodes_watched,
              }}
              refetchReviews={refetch}
            />

            <ContentMain>
              <ContentTitle
                theme_color={data.theme_color}
                title={data.name}
                score={data.vote_average}
                air_date={data.air_date}
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
                status={data.status}
                numberOfEpisodes={data.number_of_episodes}
                numberOfSeasons={data.number_of_seasons}
              />
              <SeasonsBlock seasons={data.seasons} />
              <CastBlock cast={data.credits.cast} />
              <CrewBlock crew={data.credits.crew} />
              <ReviewsBlock reviews={data.reviews} />
            </ContentMain>
          </ContentGrid>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default TVPage;
