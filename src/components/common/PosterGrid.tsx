import HorizontalScrollContainer from "./HorizontalScrollContainer";

interface IPosterGrid {
  children: JSX.Element | JSX.Element[];
  hasScrollContainer?: boolean;
}

const PosterGrid = ({ children, hasScrollContainer = false }: IPosterGrid) => {
  if (hasScrollContainer) {
    return (
      <HorizontalScrollContainer>
        <div className="flex gap-4">{children}</div>
      </HorizontalScrollContainer>
    );
  }

  return (
    <div className="grid justify-center grid-cols-2 gap-4 md:px-4 md:justify-start sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {children}
    </div>
  );
};

export { PosterGrid };
