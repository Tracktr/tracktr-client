export const LoadingPoster = () => (
  <div className="flex flex-col gap-y-[6px]">
    <div className="animate-pulse w-[170px] h-[240px] rounded bg-[#343434]" />
  </div>
);

const LoadingPosters = () => {
  return (
    <div className="grid gap-4 py-5 grid-cols-fluid">
      <LoadingPoster />
      <LoadingPoster />
      <LoadingPoster />
      <LoadingPoster />
      <LoadingPoster />
      <LoadingPoster />
    </div>
  );
};

export default LoadingPosters;
