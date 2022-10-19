import SearchHeader from "@/components/search/SearchHeader";
import { fetchMoviesContent } from "@/utils/fetchQueries";
import ContentInfiniteScroll from "../../components/content/ContentInfiniteScroll";

const MoviesPage = () => (
  <>
    <SearchHeader
      title="Movies"
      type="movie"
      backgroundImage="https://www.themoviedb.org/t/p/original/wQxPlS65wgy6Ik7N80bsMpAkjyf.jpg"
    />

    <div className="py-12">
      <div className="max-w-6xl m-auto">
        <ContentInfiniteScroll
          title="Movies"
          type="Movies"
          fetchContent={(page) =>
            fetchMoviesContent({
              type: "discover",
              limiter: "movie",
              sortBy: "popularity.desc",
              page,
            })
          }
        />
      </div>
    </div>
  </>
);

export default MoviesPage;
