import LoadingPageComponents from "@/components/common/loading/LoadingPageComponents";
import ContentHeader from "@/components/content/ContentHeader";
import { fetchPersonContent } from "@/utils/fetchQueries";
import { GetStaticPaths, GetStaticProps } from "next";
import { useQuery } from "react-query";

const PersonPage = ({ props }: any) => {
  const { data, status } = useQuery(["person", props.id], () =>
    fetchPersonContent({
      personID: props.id,
    })
  );

  return (
    <LoadingPageComponents status={status}>
      {() => <ContentHeader cover="" poster={data.profile_path} title={data.name} description={data.biography} />}
    </LoadingPageComponents>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.personID as string;

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

export default PersonPage;
