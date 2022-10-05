import { GetStaticProps } from "next";
import { QueryClient, dehydrate } from "react-query";
import ContentRow from "../../modules/ContentRow";
import fetchMinimizedContent from "../../utils/fetchQueries";

const SeriesPage = () => (
  <div className="pt-12 pb-5">
    <div className="mx-2 md:mx-auto max-w-6xl pt-2 border-t-2 border-[#343434]">
      <ContentRow
        type="Series"
        fetchContent={() =>
          fetchMinimizedContent({
            type: "discover",
            limiter: "tv",
            sortBy: "popularity.desc",
          })
        }
      />
      <div className="flex items-center justify-center">
        <div className="px-10 py-2 border-2 rounded-full cursor-pointer select-none border-primary text-primary">
          Load more...
        </div>
      </div>
    </div>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["getSeriesContent", "popularity.desc"], () =>
    fetchMinimizedContent({
      type: "discover",
      limiter: "tv",
      sortBy: "popularity.desc",
    })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default SeriesPage;
