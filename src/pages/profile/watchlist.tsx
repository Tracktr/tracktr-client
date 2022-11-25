import { trpc } from "../../utils/trpc";

const WatchlistPage = () => {
  const { data, status } = trpc.profile.watchlist.useQuery();

  return <div></div>;
};

export default WatchlistPage;
