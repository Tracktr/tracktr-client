interface IWatchedButton {
  onClick?: () => void;
  onKeyDown?: (e: any) => void;
  themeColor: any;
  children: JSX.Element | JSX.Element[];
}

const Button = ({ onClick, onKeyDown, children, themeColor }: IWatchedButton) => (
  <div
    style={{
      borderColor: themeColor.hex,
      background: themeColor.hex,
    }}
    className={`
      text-left px-3 my-2 flex justify-between py-2 align-middle items-center gap-2 rounded font-bold text-white 
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

export default Button;
