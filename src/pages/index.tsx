import SearchHeader from "src/components/search/SearchHeader";
import type { NextPage } from "next";

const Home: NextPage = () => (
  <SearchHeader
    title="things to watch"
    type="multi"
    backgroundImage="https://www.themoviedb.org/t/p/original/xMMrBziwJqrgjerqpNeQvwuwiUp.jpg"
  />
);

export default Home;
