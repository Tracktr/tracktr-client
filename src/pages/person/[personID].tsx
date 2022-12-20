import { useRouter } from "next/router";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { trpc } from "../../utils/trpc";
import ContentBackdrop from "../../components/pageBlocks/ContentBackdrop";
import ContentPoster from "../../components/pageBlocks/ContentPoster";
import ContentTitle from "../../components/pageBlocks/ContentTitle";
import ContentOverview from "../../components/pageBlocks/ContentOverview";
import ContentGrid from "../../components/pageBlocks/ContentGrid";
import ContentMain from "../../components/pageBlocks/ContentMain";
import CreditsBlock from "../../components/pageBlocks/CreditsBlock";
import Head from "next/head";

const PersonPage = () => {
  const router = useRouter();
  const { data, status } = trpc.person.personById.useQuery(
    { slug: String(router.query.personID) },
    { enabled: router.isReady }
  );

  return (
    <LoadingPageComponents status={status} notFound>
      {() => (
        <>
          <Head>
            <title>{data.name} - Tracktr.</title>
          </Head>

          <ContentBackdrop />

          <ContentGrid>
            <ContentPoster
              title={data.name}
              poster={data.profile_path}
              id={data.id}
              theme_color={data.theme_color}
              hideWatchButton
            />

            <ContentMain>
              <ContentTitle theme_color={data.theme_color} title={data.name} gender={data.gender} />
              <ContentOverview name={data.name} overview={data.biography} theme_color={data.theme_color} />
              <CreditsBlock credits={{ movie: data.movie_credits, tv: data.tv_credits }} />
            </ContentMain>
          </ContentGrid>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default PersonPage;
