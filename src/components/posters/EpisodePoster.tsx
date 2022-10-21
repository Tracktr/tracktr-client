import Image from "next/image";
import Link from "next/link";
import { PosterImage } from "../../utils/generateImages";

export interface IEpisodePoster {
  imageSrc: string;
  name: string;
  url?: string;
  overview: string;
  season: string;
  episode: string;
}

const EpisodePoster = ({ imageSrc, name, url, overview, season, episode }: IEpisodePoster) => (
  <Link href={url || "#"}>
    <a className={`md:flex ${url ? "" : "pointer-events-none"}`}>
      <div className="flex-shrink-0">
        <Image src={PosterImage({ path: imageSrc, size: "md" })} width="300px" height="168px" className="rounded" />
      </div>
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
);

export default EpisodePoster;
