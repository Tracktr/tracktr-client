import Head from "next/head";
import MoviesInfiniteScroll from "../../components/infiniteScroll/MoviesInfiniteScroll";
import SearchHeader from "../../components/search/SearchHeader";

const MoviesPage = () => (
  <>
    <Head>
      <title>Movies - Tracktr.</title>
    </Head>

    <SearchHeader
      title="Movies"
      type="movie"
      backgroundImage="https://www.themoviedb.org/t/p/original/wQxPlS65wgy6Ik7N80bsMpAkjyf.jpg"
    />

    <div className="py-12">
      <div className="max-w-6xl m-auto">
        <MoviesInfiniteScroll />
      </div>
    </div>
  </>
);

export default MoviesPage;
