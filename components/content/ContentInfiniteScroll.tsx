import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "react-query";
import LoadingPageComponents from "../common/loading/LoadingPageComponents";
import { LoadingPoster } from "../common/poster/LoadingPosters";
import MoviePoster from "../common/poster/MoviePoster";
import PersonPoster from "../common/poster/PersonPoster";
import TVPoster from "../common/poster/TVPoster";

interface IContentInfiniteScroll {
  fetchContent: (page: number) => any;
  type: "Movies" | "TV" | "Person";
  title: string;
}

const ContentInfiniteScroll = ({ fetchContent, type, title }: IContentInfiniteScroll) => {
  const MAX_PAGES = 5;
  const { ref, inView } = useInView();

  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    [`${type}`, "popularity.desc"],
    ({ pageParam = 1 }) => fetchContent(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.results.length !== 0 && lastPage.page <= MAX_PAGES ? nextPage : undefined;
      },
    }
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <div>
      <div className="z-40 text-4xl">{title}</div>
      <LoadingPageComponents status={status}>
        {() => (
          <div className="flex flex-wrap items-center gap-4 py-5">
            {data?.pages.map((page) =>
              page.results.map((content: any) => {
                if (type === "TV") {
                  return (
                    <TVPoster
                      imageSrc={`${content.poster_path}`}
                      name={content.title || content.name}
                      key={content.id}
                      url={`tv/${content.id}`}
                    />
                  );
                }

                if (type === "Movies") {
                  return (
                    <MoviePoster
                      imageSrc={`${content.poster_path}`}
                      name={content.title || content.name}
                      key={content.id}
                      url={`movies/${content.id}`}
                    />
                  );
                }

                if (type === "Person") {
                  return (
                    <PersonPoster
                      imageSrc={`${content.poster_path || content.profile_path}`}
                      name={content.title || content.name}
                      key={content.id}
                      url={`person/${content.id}`}
                    />
                  );
                }

                return <div />;
              })
            )}
            <div className="loader" ref={ref}>
              {isFetchingNextPage && hasNextPage && <LoadingPoster />}
            </div>
          </div>
        )}
      </LoadingPageComponents>
    </div>
  );
};

export default ContentInfiniteScroll;
