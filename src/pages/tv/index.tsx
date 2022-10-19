import TVInfiniteScroll from "../../components/infiniteScroll/TVInfiniteScroll";
import SearchHeader from "../../components/search/SearchHeader";

const TVPage = () => (
  <div>
    <SearchHeader
      title="Series"
      type="tv"
      backgroundImage="https://www.themoviedb.org/t/p/original/Aa9TLpNpBMyRkD8sPJ7ACKLjt0l.jpg"
    />
    <div className="pt-12 pb-5">
      <div className="max-w-6xl mx-2 md:mx-auto">
        <TVInfiniteScroll />
      </div>
    </div>
  </div>
);

export default TVPage;
