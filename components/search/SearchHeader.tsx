import { useRouter } from "next/router";
import { ChangeEvent, KeyboardEventHandler, useState } from "react";

interface ISearchHeader {
  type: string;
  backgroundImage: string;
}

const SearchHeader = ({ type, backgroundImage }: ISearchHeader) => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setSearchInput(value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/search?query=${searchInput}`);
    }
  };

  return (
    <div>
      <div
        className="absolute top-0 w-full h-96 blur-sm"
        style={{
          background: `linear-gradient(0deg, #101010 3.79%, rgba(16, 16, 16, 0) 100%), url(${backgroundImage}) no-repeat center`,
        }}
      />
      <div className="relative z-10 flex w-full max-w-6xl m-auto h-96">
        <div className="w-full h-auto m-auto">
          <div className="text-5xl font-bold">
            Find amazing {type}
            <span className="text-primary">.</span>
          </div>
          <div className="mt-4">
            <input
              className="h-10 p-4 bg-white rounded-full text-primaryBackground pr-14 md:w-96 text-md focus:outline-none"
              type="text"
              placeholder="Search Movie"
              value={searchInput}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
