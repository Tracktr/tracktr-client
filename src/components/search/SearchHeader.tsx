import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { IoSearch } from "react-icons/io5";

interface ISearchHeader {
  title: string;
  type?: string;
  backgroundImage: string;
}

const SearchHeader = ({ title, type, backgroundImage }: ISearchHeader) => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setSearchInput(value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/search/${type}?query=${searchInput}`);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnClick = (e: any) => {
    e.preventDefault();
    router.push(`/search/${type}/?query=${searchInput}`);
  };

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
          <div className="relative w-full px-4 mt-4 md:px-0 md:w-96">
            <input
              className="w-full h-10 p-4 bg-white rounded-full text-primaryBackground pr-14 text-md focus:outline-none"
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
            />
            <IoSearch
              onClick={handleOnClick}
              size={24}
              className="absolute top-0 z-10 h-10 mr-4 cursor-pointer right-4 md:right-0 text-primaryBackground"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
