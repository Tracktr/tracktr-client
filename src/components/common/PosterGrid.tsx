import HorizontalScrollContainer from "./HorizontalScrollContainer";

interface IPosterGrid {
  children: JSX.Element | JSX.Element[];
}

const PosterGrid = ({ children }: IPosterGrid) => {
  return (
    <HorizontalScrollContainer>
      <div className="flex gap-4">{children}</div>
    </HorizontalScrollContainer>
  );
};

export default PosterGrid;
