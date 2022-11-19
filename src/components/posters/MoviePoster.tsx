import Image from "next/image";
import Link from "next/link";
import { AiFillStar, AiOutlineCheckCircle } from "react-icons/ai";
import { IoMdRemoveCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { PosterImage } from "../../utils/generateImages";
export interface IPoster {
  imageSrc: string;
  name: string;
  url?: string;
  score?: number;
  id: number;
  watched: boolean;
  markAsWatched: (e: any) => any;
}

const MoviePoster = ({ imageSrc, name, url, score, markAsWatched, id, watched }: IPoster) => (
  <div className="group">
    <div className="relative">
      <Link href={url || "#"}>
        <a className={`relative ${url ? "" : "pointer-events-none"}`}>
          <Image
            alt={"Poster image for" + name}
            src={PosterImage({ path: imageSrc, size: "sm" })}
            width="170px"
            height="240px"
            className="rounded"
          />
          <div className="absolute bottom-0 left-0 z-10 flex items-center justify-center w-full max-w-[170px] transition-all duration-300 ease-in-out opacity-0 select-none group-hover:opacity-100 bg-gradient-to-t from-primaryBackground">
            {score !== undefined && (
              <div className="flex justify-end w-full">
                <span className="flex items-center p-2 text-sm">
                  <AiFillStar className="mr-2 text-primary" size={18} />
                  {score > 0 ? score.toPrecision(2) + "/10" : "N/A"}
                </span>
              </div>
            )}
          </div>
        </a>
      </Link>
    </div>
    <div className="text-xs max-w-[170px] px-1 truncate">{name}</div>
    <div className="pt-1 text-gray-500 transition-all duration-300 ease-in-out opacity-25 group-hover:opacity-100">
      <button
        className="text-xl transition-all duration-300 ease-in-out hover:text-red-700"
        onClick={() => {
          markAsWatched({
            movieId: id,
          });
        }}
      >
        {watched ? <MdDelete /> : <AiOutlineCheckCircle />}
      </button>
    </div>
  </div>
);

export default MoviePoster;
