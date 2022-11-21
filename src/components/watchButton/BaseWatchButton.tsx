interface IBaseWatchButton {
  onClick?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  themeColor: IThemeColor;
  children: JSX.Element | JSX.Element[];
}

export interface IThemeColor {
  value: number[];
  rgb: string;
  rgba: string;
  hex: string;
  hexa: string;
  isDark: boolean;
  isLight: boolean;
}

const BaseWatchButton = ({ onClick, onKeyDown, children, themeColor }: IBaseWatchButton) => (
  <div
    style={{
      borderColor: themeColor.hex,
      background: themeColor.hex,
    }}
    className={`
      text-left px-3 my-2 flex justify-between py-2 align-middle items-center gap-2 rounded font-bold 
      ${onClick === undefined && onKeyDown === undefined && "cursor-default select-auto"}
      ${themeColor.isDark && "text-white"}
      ${themeColor.isLight && "text-primaryBackground"}
    `}
    onClick={onClick}
    onKeyDown={onKeyDown}
    role="button"
    tabIndex={0}
  >
    {children}
  </div>
);

export default BaseWatchButton;
