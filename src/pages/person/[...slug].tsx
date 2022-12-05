import { useRouter } from "next/router";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ContentHeader from "../../components/pageBlocks/ContentHeader";
import CreditsBlock from "../../components/pageBlocks/CreditsBlock";
import { trpc } from "../../utils/trpc";

const PersonPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data, status } = trpc.person.personById.useQuery({ slug: slug ? slug[0] : undefined });

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <ContentHeader
          cover=""
          gender={data.gender}
          poster={data.profile_path}
          title={data.name}
          description={data.biography}
          themeColor={data.theme_color}
        >
          <CreditsBlock credits={{ movie: data.movie_credits, tv: data.tv_credits }} />
        </ContentHeader>
      )}
    </LoadingPageComponents>
  );
};

export default PersonPage;
