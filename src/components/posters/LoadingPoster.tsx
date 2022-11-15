import PosterGrid from "../common/PosterGrid";

export const LoadingPoster = () => (
  <div className="flex flex-col gap-y-[6px]">
    <div className="animate-pulse w-[170px] h-[240px] rounded bg-[#343434]" />
  </div>
);

const LoadingPosters = () => {
  return (
    <PosterGrid>
      <LoadingPoster />
      <LoadingPoster />
      <LoadingPoster />
      <LoadingPoster />
      <LoadingPoster />
      <LoadingPoster />
    </PosterGrid>
  );
};

export default LoadingPosters;
