import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { CgCross, CgSearch } from "react-icons/cg";
import { ImSpinner2 } from "react-icons/im";
import { trpc } from "../../utils/trpc";

const Search = ({ type }: { type: string | undefined }) => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [enabled, setEnabled] = useState(false);

  const { data, status, fetchStatus } = trpc.multi.searchMulti.useQuery(
    { query: searchInput },
    {
      enabled: searchInput.length > 3 ?? setEnabled(true),
    }
  );

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setSearchInput(value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/search/${type}?query=${searchInput}`);
    }
  };

  const handleOnClick = (e: any) => {
    e.preventDefault();
    router.push(`/search/${type}/?query=${searchInput}`);
  };

  const icon = () => {
    if (fetchStatus === "idle" || fetchStatus === "paused") {
      return <CgSearch onClick={handleOnClick} size={24} className="mx-2" />;
    } else if (fetchStatus === "fetching") {
      return <ImSpinner2 size={24} className="mx-2 animate-spin" />;
    }
  };

  return (
    <div className="flex py-2 text-gray-500 bg-white rounded-lg">
      {icon()}

      <input
        className="w-full outline-none"
        type="text"
        placeholder="Search..."
        value={searchInput}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Search;
