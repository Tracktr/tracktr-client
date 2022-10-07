import { useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import { LoadingPoster } from "../common/poster/LoadingPosters";
import Poster from "../common/poster/Poster";

interface IContentInfiniteScroll {
  fetchContent: (page: number) => any;
  type: "Movies" | "Series";
}

const ContentInfiniteScroll = ({ fetchContent, type }: IContentInfiniteScroll) => {
  const observerElem = useRef(null);
  const MAX_PAGES = 5;

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    [`get${type}Content`, "popularity.desc"],
    ({ pageParam = 1 }) => fetchContent(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.results.length !== 0 && lastPage.page <= MAX_PAGES ? nextPage : undefined;
      },
    }
  );

  const handleObserver = useCallback(
    (entries: any) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const element: any = observerElem.current;
    const option = { threshold: 0 };

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [fetchNextPage, hasNextPage, handleObserver]);

  return (
    <div>
      <div className="z-40 text-4xl">{type}</div>
      <div className="flex flex-wrap items-center gap-4 py-5">
        {isSuccess &&
          data.pages?.map((page) =>
            page.results.map((content: any) => (
              <Poster
                imageSrc={`${content.poster_path}`}
                name={content.title || content.name}
                id={content.id}
                type={type}
                key={content.id}
              />
            ))
          )}
        <div className="loader" ref={observerElem}>
          {isFetchingNextPage && hasNextPage && <LoadingPoster />}
        </div>
      </div>
    </div>
  );
};

export default ContentInfiniteScroll;
