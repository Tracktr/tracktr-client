import Image from "next/image";
import Link from "next/link";
import { PersonImage } from "../../utils/generateImages";

export interface IPoster {
  imageSrc: string;
  name: string;
  url?: string;
}

const PersonPoster = ({ imageSrc, name, url }: IPoster) => (
  <Link href={url || "#"}>
    <a className={url ? "" : "pointer-events-none"}>
      <Image
        src={PersonImage({ path: imageSrc, size: "sm" })}
        width="170px"
        height="240px"
        alt={`Photo of ${name}`}
        className="rounded"
      />
      <div className="text-xs max-w-[170px] px-1 truncate">{name}</div>
    </a>
  </Link>
);

export default PersonPoster;
