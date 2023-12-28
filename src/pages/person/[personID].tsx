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
import { PersonImage } from "../../utils/generateImages";
import { appRouter } from "../../server/trpc/router/_app";
import { createContext } from "../../server/trpc/context";
import SuperJSON from "superjson";
import { InferGetServerSidePropsType } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";

const PersonPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data, status } = trpc.person.personById.useQuery({ slug: props.personID }, { enabled: false });

  return (
    <LoadingPageComponents status={status} notFound>
      {() => (
        <>
          <Head>
            <title>{`${data.name} - Tracktr.`}</title>

            <meta property="og:image" content={PersonImage({ path: data.profile_path, size: "md" })} />
            <meta name="description" content={`Track movies & series starring ${data.name} with Tracktr.`} />
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

export async function getServerSideProps(context: any) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext({ req: context.req, res: context.res, info: context.info }),
    transformer: SuperJSON,
  });
  await helpers.person.personById.prefetch({ slug: String(context.query.personID) });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      personID: context.query.personID,
    },
  };
}

export default PersonPage;
