import Image from "next/image";
import Link from "next/link";
import { AiFillStar } from "react-icons/ai";
import { ImCheckmark2 } from "react-icons/im";
import { PosterImage } from "../../utils/generateImages";

export interface IEpisodePoster {
  imageSrc: string;
  name: string;
  url?: string;
  overview: string;
  season: string;
  episode: string;
  score?: number;
  markAsWatched: (e: any) => void;
  series_id: number;
}

const EpisodePoster = ({
  imageSrc,
  name,
  url,
  overview,
  season,
  episode,
  score,
  markAsWatched,
  series_id,
}: IEpisodePoster) => (
  <div className="md:flex">
    <div className="relative flex-shrink-0">
      <Link href={url || "#"}>
        <a>
          <Image
            alt={"still image for" + name}
            src={PosterImage({ path: imageSrc, size: "md" })}
            width="300px"
            height="168px"
            className="rounded"
          />
        </a>
      </Link>
      <div className="absolute bottom-0 left-0 z-10 flex items-center w-full select-none bg-gradient-to-t from-primaryBackground">
        <button
          className="flex justify-center p-2 text-2xl text-opacity-100"
          onClick={() =>
            markAsWatched({
              episodeNumber: episode,
              seasonNumber: season,
              seriesId: series_id,
            })
          }
        >
          <ImCheckmark2 />
        </button>
        {score !== undefined && (
          <div className="flex items-end">
            <span className="flex items-center p-2">
              <AiFillStar className="mr-2 text-primary" size={24} />
              {score > 0 ? score.toPrecision(2) + " / 10" : "N/A"}
            </span>
          </div>
        )}
      </div>
    </div>
    <Link href={url || "#"}>
      <a>
        <div className="max-w-md py-4 md:py-0 md:pl-2">
          <p className="pb-2 font-bold text-md">
            <span className="px-3 py-1 mr-2 rounded-full bg-primary text-primaryBackground">
              {season}x{episode}
            </span>
            {name}
          </p>
          <p className="text-sm">{overview}</p>
        </div>
      </a>
    </Link>
  </div>
);

export default EpisodePoster;
