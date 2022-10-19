import { PosterImage } from "src/utils/generateImages";
import Image from "next/image";
import Link from "next/link";

export interface IPoster {
  imageSrc: string;
  name: string;
  url?: string;
}

const MoviePoster = ({ imageSrc, name, url }: IPoster) => (
  <Link href={url || "#"}>
    <a className={url ? "" : "pointer-events-none"}>
      <Image src={PosterImage({ path: imageSrc, size: "sm" })} width="170px" height="240px" className="rounded" />
      <div className="text-xs max-w-[170px] px-1 truncate">{name}</div>
    </a>
  </Link>
);

export default MoviePoster;
