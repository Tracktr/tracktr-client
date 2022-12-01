import Image from "next/image";
import Link from "next/link";
import { PersonImage } from "../../utils/generateImages";

export interface IPoster {
  imageSrc: string;
  name: string;
  url?: string;
  job?: string;
}

const PersonPoster = ({ imageSrc, name, url, job }: IPoster) => (
  <Link href={url || "#"}>
    <a className={url ? "" : "pointer-events-none"}>
      <Image
        src={PersonImage({ path: imageSrc, size: "sm" })}
        width="170px"
        height="240px"
        alt={`Photo of ${name}`}
        className="rounded"
      />
      <div className="text-xs max-w-[170px] px-1 truncate">
        {name}

        {job && (
          <>
            <br />
            <span className="pt-1 italic truncate">{job}</span>
          </>
        )}
      </div>
    </a>
  </Link>
);

export default PersonPoster;
