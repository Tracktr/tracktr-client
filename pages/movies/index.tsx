import { GetStaticProps } from "next";
import { QueryClient, dehydrate } from "react-query";
import ContentInfiniteScroll from "../../modules/ContentInfiniteScroll";
import fetchMinimizedContent from "../../utils/fetchQueries";

const MoviesPage = () => (
  <div className="pt-12 pb-5">
    <div className="mx-2 md:mx-auto max-w-6xl pt-2 border-t-2 border-[#343434]">
      <ContentInfiniteScroll
        type="Movies"
        fetchContent={(page) =>
          fetchMinimizedContent({
            type: "discover",
            limiter: "movie",
            sortBy: "popularity.desc",
            page,
          })
        }
      />
    </div>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["getMoviesContent", "popularity.desc"], () =>
    fetchMinimizedContent({
      type: "discover",
      limiter: "movie",
      sortBy: "popularity.desc",
      page: 1,
    })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default MoviesPage;
