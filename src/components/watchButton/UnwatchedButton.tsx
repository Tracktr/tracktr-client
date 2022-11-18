import { ImCheckmark } from "react-icons/im";
import Button from "./Button";

interface IUnwatchedButtonProps {
  themeColor: string;
  handleOnClick: (e: any) => void;
}

const UnwatchedButton = ({ themeColor, handleOnClick }: IUnwatchedButtonProps) => {
  return (
    <Button themeColor={themeColor} onClick={(e: void) => handleOnClick(e)} onKeyDown={handleOnClick}>
      <div>Add to watched</div>
      <div>
        <ImCheckmark className="mr-1 text-lg" />
      </div>
    </Button>
  );
};

export default UnwatchedButton;
