import ContentInfiniteScroll from "../../components/common/MoviesInfiniteScroll";
import SearchHeader from "../../components/search/SearchHeader";

const MoviesPage = () => (
  <>
    <SearchHeader
      title="Movies"
      type="movie"
      backgroundImage="https://www.themoviedb.org/t/p/original/wQxPlS65wgy6Ik7N80bsMpAkjyf.jpg"
    />

    <div className="py-12">
      <div className="max-w-6xl m-auto">
        <ContentInfiniteScroll />
      </div>
    </div>
  </>
);

export default MoviesPage;
