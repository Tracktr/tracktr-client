const ContentGrid = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <div className="relative w-full">
      <div className="grid max-w-6xl grid-cols-1 pt-24 m-auto md:grid-cols-4 md:pt-96">{children}</div>
    </div>
  );
};

export default ContentGrid;
