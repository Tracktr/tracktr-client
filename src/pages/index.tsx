import type { NextPage } from "next";
import SearchHeader from "../components/search/SearchHeader";

const Home: NextPage = () => {
  return (
    <SearchHeader
      title="things to watch"
      type="multi"
      backgroundImage="https://www.themoviedb.org/t/p/original/xMMrBziwJqrgjerqpNeQvwuwiUp.jpg"
    />
  );
};

export default Home;
