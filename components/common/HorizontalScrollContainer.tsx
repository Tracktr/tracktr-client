import ScrollContainer from "react-indiana-drag-scroll";
import "react-indiana-drag-scroll/dist/style.css";

const HorizontalScrollContainer = ({ children }: any) => (
  <ScrollContainer className="flex space-x-2 cursor-grab">{children}</ScrollContainer>
);

export default HorizontalScrollContainer;
