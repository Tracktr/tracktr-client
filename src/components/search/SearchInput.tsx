import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { CgSearch } from "react-icons/cg";
import { ImSpinner2 } from "react-icons/im";
import { PosterImage, PersonImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";

const SearchInput = ({ type }: { type: string | undefined }) => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const { data, fetchStatus, status } = trpc.multi.searchMulti.useQuery(
    { query: searchInput },
    {
      enabled: searchInput.length > 3,
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

  const url = ({ id, media_type }: { id: string; media_type: string }) => {
    if (type === "movie" || media_type === "movie") {
      return "/movies/" + id;
    } else if (type === "tv" || media_type === "tv") {
      return "/tv/" + id;
    } else if (type === "person" || media_type === "person") {
      return "/person/" + id;
    }
  };

  return (
    <div className="relative">
      <div
        className={`
        flex max-w-md py-2 mt-2 text-gray-500 bg-white
        ${status === "success" ? "rounded-t-md rounded-b-none" : "rounded-md"}
      `}
      >
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
      {data && (
        <div className="absolute grid w-full max-w-md grid-cols-4 py-4 bg-white rounded-b-md text-primaryBackground">
          {data.results.slice(0, 4).map((item: any) => (
            <Link
              href={`${url({
                id: item.id,
                media_type: item.media_type,
              })}`}
              key={item.id}
            >
              <a className="w-full text-center group">
                <div className="relative group">
                  <Image
                    alt={"image for" + item.original_title || item.original_name || item.name}
                    src={
                      (item.poster_path && PosterImage({ path: item.poster_path, size: "sm" })) ||
                      (item.profile_path && PersonImage({ path: item.profile_path, size: "sm" })) ||
                      "/noimage.png"
                    }
                    width="85px"
                    height="120px"
                    className="rounded"
                  />
                </div>
                <div className="px-2 text-xs">{item.original_title || item.original_name || item.name}</div>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
