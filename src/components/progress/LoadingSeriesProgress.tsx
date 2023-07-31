const LoadingSeriesProgress = () => {
  return (
    <div className="flex flex-col gap-2 mx-4 md:flex-row">
      <div className="flex justify-center md:block">
        <div className="animate-pulse w-[150px] h-[250px] rounded bg-[#343434]" />
      </div>
      <div className="md:hidden animate-pulse w-full h-[24px] rounded-full bg-[#343434]" />
      <div className="w-full">
        <div className="animate-pulse w-[200px] h-[24px] rounded bg-[#343434] mb-2" />
        <div className="animate-pulse w-full h-[24px] rounded bg-[#343434] mb-1" />
        <div className="md:hidden animate-pulse w-full h-[24px] rounded bg-[#343434] mb-2" />
        <div className="animate-pulse w-full h-[24px] rounded bg-[#343434] mb-4" />
        <div className="animate-pulse w-[75px] h-[24px] rounded bg-[#343434]" />
        <div className="flex items-center gap-1">
          <div className="animate-pulse w-[52px] h-[32px] rounded-full bg-[#343434]" />
          <div className="animate-pulse w-[100px] h-[20px] rounded bg-[#343434]" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSeriesProgress;
