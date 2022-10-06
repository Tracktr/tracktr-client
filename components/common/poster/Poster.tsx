import Image from "next/image";
import Link from "next/link";

export interface IPoster {
  imageSrc: string;
  name: string;
  id?: string;
  type?: "Movies" | "Series" | "Season";
}

const Poster = ({ imageSrc, name, id, type }: IPoster) => (
  <Link href={`${type?.toLowerCase()}/${id}`}>
    <a>
      <Image src={`https://image.tmdb.org/t/p/w185${imageSrc}`} width="170px" height="240px" className="rounded" />
      <div className="text-xs max-w-[170px] px-1 truncate">{name}</div>
    </a>
  </Link>
);

export const BackgroundPoster = ({ imageSrc, name }: IPoster) => (
  <div>
    <div
      className="h-[180px] w-[127px] bg-cover rounded-t-lg"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/w185${imageSrc})`,
      }}
    />

    <div className="py-2 text-xs text-center rounded-b-lg bg-black/25">
      <div className="max-w-[127px] px-1 truncate">{name}</div>
    </div>
  </div>
);

export default Poster;
