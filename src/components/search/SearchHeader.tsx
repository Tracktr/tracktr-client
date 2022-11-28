import Search from "./Search";

interface ISearchHeader {
  title: string;
  type?: string;
  backgroundImage: string;
}

const SearchHeader = ({ title, type, backgroundImage }: ISearchHeader) => {
  return (
    <div>
      <div
        className="absolute top-0 w-full h-96 blur-sm"
        style={{
          background: `linear-gradient(0deg, #101010 3.79%, rgba(16, 16, 16, 0) 100%), url(${backgroundImage}) no-repeat center`,
          backgroundSize: "cover",
        }}
      />
      <div className="relative z-10 flex w-full max-w-6xl m-auto h-96">
        <div className="w-full h-auto m-auto">
          <div className="text-5xl font-bold leading-tight text-center md:text-left">
            Find amazing {title}
            <span className="text-primary">.</span>
          </div>
          <Search type={type} />
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
