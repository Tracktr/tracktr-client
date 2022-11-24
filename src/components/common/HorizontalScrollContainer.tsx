import { useScrollContainer } from "react-indiana-drag-scroll";
import "react-indiana-drag-scroll/dist/style.css";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const HorizontalScrollContainer = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const { ref } = useScrollContainer();

  return (
    <SimpleBar scrollableNodeProps={{ ref }} className="flex space-x-2">
      <div className="flex mb-4 space-x-2">{children}</div>
    </SimpleBar>
  );
};

export default HorizontalScrollContainer;
