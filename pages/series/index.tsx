import ContentInfiniteScroll from "@/components/content/ContentInfiniteScroll";
import { fetchMinimizedContent } from "@/utils/fetchQueries";

const SeriesPage = () => (
  <div className="pt-12 pb-5">
    <div className="mx-2 md:mx-auto max-w-6xl pt-2 border-t-2 border-[#343434]">
      <ContentInfiniteScroll
        type="Series"
        fetchContent={(page) =>
          fetchMinimizedContent({
            type: "discover",
            limiter: "tv",
            sortBy: "popularity.desc",
            page,
          })
        }
      />
    </div>
  </div>
);

export default SeriesPage;
