import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "react-query";
import LoadingPageComponents from "../common/loading/LoadingPageComponents";
import { LoadingPoster } from "../common/poster/LoadingPosters";
import Poster from "../common/poster/Poster";

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
              page.results.map((content: any) => (
                <Poster
                  type={type.toLowerCase()}
                  imageSrc={`${content.poster_path || content.profile_path}`}
                  name={content.title || content.name}
                  url={`${type.toLowerCase()}/${content.id}`}
                  key={content.id}
                />
              ))
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
