import { ImSpinner2 } from "react-icons/im";
import Button from "./Button";

interface ILoadingButtonProps {
  themeColor: any;
}

const LoadingButton = ({ themeColor }: ILoadingButtonProps) => {
  return (
    <Button themeColor={themeColor}>
      <div>Adding to list</div>
      <div>
        <ImSpinner2 className="w-6 h-6 animate-spin" />
      </div>
    </Button>
  );
};

export default LoadingButton;
