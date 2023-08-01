import { PosterGrid } from "../common/PosterGrid";

export const LoadingPoster = ({ hidden }: { hidden?: boolean }) => (
  <div className={`${hidden ? "hidden md:flex" : "flex"} flex-col gap-y-[6px]`}>
    <div className="animate-pulse h-[240px] rounded bg-[#343434]" />
  </div>
);

const LoadingPosters = () => {
  return (
    <PosterGrid>
      <LoadingPoster />
      <LoadingPoster />
      <LoadingPoster hidden />
      <LoadingPoster hidden />
      <LoadingPoster hidden />
      <LoadingPoster hidden />
    </PosterGrid>
  );
};

export default LoadingPosters;
