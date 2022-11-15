interface IPosterGrid {
  children: JSX.Element | JSX.Element[];
}

const PosterGrid = ({ children }: IPosterGrid) => {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{children}</div>;
};

export default PosterGrid;
