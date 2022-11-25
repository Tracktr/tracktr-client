interface IBaseWatchButton {
  onClick?: (e: any) => void;
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

const BaseWatchButton = ({ onClick, children, themeColor }: IBaseWatchButton) => (
  <button
    style={{
      borderColor: themeColor.hex,
      background: themeColor.hex,
    }}
    className={`
      text-left px-3 py-2 rounded font-bold w-full
      ${themeColor.isDark && "text-white"}
      ${themeColor.isLight && "text-primaryBackground"}
    `}
    onClick={onClick}
  >
    {children}
  </button>
);

export default BaseWatchButton;
