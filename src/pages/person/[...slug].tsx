import { useRouter } from "next/router";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { trpc } from "../../utils/trpc";
import ContentBackdrop from "../../components/pageBlocks/ContentBackdrop";
import ContentPoster from "../../components/pageBlocks/ContentPoster";
import ContentTitle from "../../components/pageBlocks/ContentTitle";
import ContentOverview from "../../components/pageBlocks/ContentOverview";
import ContentGrid from "../../components/pageBlocks/ContentGrid";

const PersonPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data, status } = trpc.person.personById.useQuery({ slug: slug ? slug[0] : undefined });

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <>
          <ContentBackdrop />

          <ContentGrid>
            <ContentPoster
              title={data.name}
              poster={data.profile_path}
              id={data.id}
              theme_color={data.theme_color}
              hideWatchButton
            />

            <div className="col-span-3 px-4">
              <ContentTitle theme_color={data.theme_color} title={data.name} gender={data.gender} />
              <ContentOverview name={data.name} overview={data.biography} theme_color={data.theme_color} />
            </div>
          </ContentGrid>
        </>
      )}
    </LoadingPageComponents>
  );
};

export default PersonPage;
