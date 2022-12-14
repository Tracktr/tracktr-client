import { ImSpinner2 } from "react-icons/im";
import BaseWatchButton, { IThemeColor } from "./BaseWatchButton";

interface ILoadingWatchButtonProps {
  themeColor: IThemeColor;
}

const LoadingWatchButton = ({ themeColor }: ILoadingWatchButtonProps) => {
  return (
    <BaseWatchButton themeColor={themeColor}>
      <div className="flex items-center justify-between">
        <div>Loading</div>
        <div>
          <ImSpinner2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
    </BaseWatchButton>
  );
};

export default LoadingWatchButton;
