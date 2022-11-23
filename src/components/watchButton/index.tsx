import { IThemeColor } from "./BaseWatchButton";
import EpisodeWatchButton from "./EpisodeWatchButton";
import MovieWatchButton from "./MovieWatchButton";

export interface IWatchButtonProps {
  itemID: number;
  episodeID: number;
  seasonID: number;
  themeColor: IThemeColor;
  refetchProgression?: () => void;
}

const WatchButton = ({ itemID, episodeID, seasonID, themeColor, refetchProgression }: IWatchButtonProps) => {
  if (episodeID && seasonID) {
    return (
      <EpisodeWatchButton
        itemID={itemID}
        episodeID={episodeID}
        seasonID={seasonID}
        themeColor={themeColor}
        refetchProgression={refetchProgression}
      />
    );
  } else {
    return (
      <MovieWatchButton
        itemID={itemID}
        episodeID={episodeID}
        seasonID={seasonID}
        themeColor={themeColor}
        refetchProgression={refetchProgression}
      />
    );
  }
};

export default WatchButton;
