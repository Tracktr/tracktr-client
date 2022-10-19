import ContentInfiniteScroll from "src/components/content/ContentInfiniteScroll";
import SearchHeader from "src/components/search/SearchHeader";
import { fetchTVsContent } from "src/utils/fetchQueries";

const TVPage = () => (
  <div>
    <SearchHeader
      title="Series"
      type="tv"
      backgroundImage="https://www.themoviedb.org/t/p/original/Aa9TLpNpBMyRkD8sPJ7ACKLjt0l.jpg"
    />
    <div className="pt-12 pb-5">
      <div className="max-w-6xl mx-2 md:mx-auto">
        <ContentInfiniteScroll
          title="Series"
          type="TV"
          fetchContent={(page) =>
            fetchTVsContent({
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

export default TVPage;
