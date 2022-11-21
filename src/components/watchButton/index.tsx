import { IThemeColor } from "./BaseWatchButton";
import EpisodeWatchButton from "./EpisodeWatchButton";

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
    return <div>movie button</div>;
  }
};

export default WatchButton;
