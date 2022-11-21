import { IThemeColor } from "./BaseWatchButton";
import EpisodeWatchButton from "./EpisodeWatchButton";
import MovieWatchButton from "./MovieWatchButton";

export interface IWatchButtonProps {
  itemID: number;
  episodeID: number;
  seasonID: number;
  themeColor: IThemeColor;
}

const WatchButton = ({ itemID, episodeID, seasonID, themeColor }: IWatchButtonProps) => {
  if (episodeID && seasonID) {
    return <EpisodeWatchButton itemID={itemID} episodeID={episodeID} seasonID={seasonID} themeColor={themeColor} />;
  } else {
    return <MovieWatchButton itemID={itemID} episodeID={episodeID} seasonID={seasonID} themeColor={themeColor} />;
  }
};

export default WatchButton;
