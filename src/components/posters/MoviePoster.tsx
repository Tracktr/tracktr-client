import Image from "next/image";
import Link from "next/link";
import { AiFillStar } from "react-icons/ai";
import { PosterImage } from "../../utils/generateImages";

export interface IPoster {
  imageSrc: string;
  name: string;
  url?: string;
  score?: number;
}

const MoviePoster = ({ imageSrc, name, url, score }: IPoster) => (
  <Link href={url || "#"}>
    <a className={url ? "" : "pointer-events-none"}>
      <div className="relative group">
        <Image
          alt={"Poster image for" + name}
          src={PosterImage({ path: imageSrc, size: "sm" })}
          width="170px"
          height="240px"
          className="rounded"
        />
        {score !== undefined && (
          <div className="absolute bottom-0 left-0 z-10 flex items-end w-full h-16 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:bg-gradient-to-t group-hover:from-primaryBackground">
            <span className="flex items-center p-2 text-sm">
              <AiFillStar className="mr-2 text-primary" size={18} />
              {score > 0 ? score.toPrecision(2) + " / 10" : "N/A"}
            </span>
          </div>
        )}
      </div>
      <div className="text-xs max-w-[170px] px-1 truncate">{name}</div>
    </a>
  </Link>
);

export default MoviePoster;
