import Image from "next/image";
import Link from "next/link";
import { PersonImage, PosterImage } from "../../../utils/generateImages";

export interface IPoster {
  type: string;
  imageSrc: string;
  name: string;
  url?: string;
}

const Poster = ({ imageSrc, name, url, type }: IPoster) => (
  <Link href={url || "#"}>
    <a className={url ? "" : "pointer-events-none"}>
      {type === "movies" && (
        <Image src={PosterImage({ path: imageSrc, size: "sm" })} width="170px" height="240px" className="rounded" />
      )}
      {type === "series" && (
        <Image src={PosterImage({ path: imageSrc, size: "sm" })} width="170px" height="240px" className="rounded" />
      )}
      {type === "person" && (
        <Image src={PersonImage({ path: imageSrc, size: "sm" })} width="170px" height="240px" className="rounded" />
      )}
      <div className="text-xs max-w-[170px] px-1 truncate">{name}</div>
    </a>
  </Link>
);

export default Poster;
