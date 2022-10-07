import Image from "next/image";
import Link from "next/link";

export interface IStill {
  imageSrc: string;
  name: string;
  url?: string;
  overview: string;
  season: string;
  episode: string;
}

const Still = ({ imageSrc, name, url, overview, season, episode }: IStill) => (
  <Link href={url || "#"}>
    <a className={`flex ${url ? "" : "pointer-events-none"}`}>
      <div className="flex-shrink-0">
        <Image src={`https://image.tmdb.org/t/p/w300${imageSrc}`} width="300px" height="168px" className="rounded" />
      </div>
      <div className="max-w-md pl-2">
        <p className="text-md pb-2 font-bold">
          <span className="bg-primary text-primaryBackground px-3 py-1 rounded-full mr-2">
            {season}x{episode}
          </span>
          {name}
        </p>
        <p className="text-sm">{overview}</p>
      </div>
    </a>
  </Link>
);

export default Still;
