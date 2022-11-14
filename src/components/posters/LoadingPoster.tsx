export const LoadingPoster = () => (
  <div className="flex flex-col gap-y-[6px]">
    <div className="animate-pulse w-[170px] h-[240px] rounded bg-[#343434]" />
  </div>
);

const LoadingPosters = () => {
  return (
    <>
      <LoadingPoster />
      <LoadingPoster />
      <LoadingPoster />
      <LoadingPoster />
      <LoadingPoster />
      <LoadingPoster />
    </>
  );
};

export default LoadingPosters;
