import ContentInfiniteScroll from "@/components/content/ContentInfiniteScroll";
import SearchHeader from "@/components/search/SearchHeader";
import { fetchMinimizedContent } from "@/utils/fetchQueries";

const SeriesPage = () => (
  <div>
    <SearchHeader
      type="Series"
      backgroundImage="https://www.themoviedb.org/t/p/original/wQxPlS65wgy6Ik7N80bsMpAkjyf.jpg"
    />
    <div className="pt-12 pb-5">
      <div className="max-w-6xl mx-2 md:mx-auto">
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
  </div>
);

export default SeriesPage;
