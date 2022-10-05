import { useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import Poster from "../components/Poster";

interface IContentInfiniteScroll {
  fetchContent: (page: number) => any;
  type: "Movies" | "Series";
}

const ContentInfiniteScroll = ({ fetchContent, type }: IContentInfiniteScroll) => {
  const observerElem = useRef(null);

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    [`get${type}Content`, "popularity.desc"],
    ({ pageParam = 1 }) => fetchContent(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.results.length !== 0 ? nextPage : undefined;
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
    <div className="flex flex-wrap items-center gap-4 py-5">
      {isSuccess &&
        data.pages?.map((page) =>
          page.results.map((content: any) => (
            <Poster
              imageSrc={`https://image.tmdb.org/t/p/w185${content.poster_path}`}
              name={content.title || content.name}
            />
          ))
        )}
      <div className="loader" ref={observerElem}>
        {isFetchingNextPage && hasNextPage && (
          <div className="flex flex-col gap-y-[6px]">
            <div className="animate-pulse w-[170px] h-[240px] rounded bg-[#343434]" />
            <div className="animate-pulse h-4 w-[170px] rounded bg-[#343434]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentInfiniteScroll;
