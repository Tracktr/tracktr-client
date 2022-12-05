import WatchTrailerButton from "../common/buttons/WatchTrailerButton";
import JustWatch, { IJustWatchProps } from "../common/JustWatch";
import { IThemeColor } from "../watchButton/BaseWatchButton";

const ContentOverview = ({
  overview,
  videos,
  justwatch,
  theme_color,
  name,
}: {
  name: string;
  overview: string;
  theme_color: IThemeColor;
  videos?: any;
  justwatch?: {
    results: IJustWatchProps;
  };
}) => {
  return (
    <div className="grid-cols-5 lg:grid">
      <div className="max-w-full col-span-3 pt-8 lg:pb-12">
        <div className="line-clamp-6">{overview}</div>
      </div>
      <div className="col-span-2 max-w-[200px] w-full lg:ml-auto my-5">
        {videos && <WatchTrailerButton themeColor={theme_color} data={videos} />}
        {justwatch && <JustWatch justWatch={justwatch} themeColor={theme_color} name={name} />}
      </div>
    </div>
  );
};

export default ContentOverview;
