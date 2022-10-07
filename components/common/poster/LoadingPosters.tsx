/* eslint-disable react/jsx-no-useless-fragment */
interface ILoadingPosters {
  amount: number;
}

export const LoadingPoster = () => (
  <div className="flex flex-col gap-y-[6px]">
    <div className="animate-pulse w-[170px] h-[240px] rounded bg-[#343434]" />
    <div className="animate-pulse h-4 w-[170px] rounded bg-[#343434]" />
  </div>
);

const LoadingPosters = ({ amount }: ILoadingPosters) => {
  const posters = [];
  for (let i = 0; i < amount; i + 1) {
    posters.push(<LoadingPoster key={i} />);
  }

  return <>{posters}</>;
};

export default LoadingPosters;
