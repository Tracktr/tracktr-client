import Image from "next/image";
import ConditionalLink from "../../utils/ConditionalLink";
import { PersonImage } from "../../utils/generateImages";
import ImageWithFallback from "../common/ImageWithFallback";

export interface IPoster {
  imageSrc: string;
  name: string;
  url?: string;
  job?: string;
}

const PersonPoster = ({ imageSrc, name, url, job }: IPoster) => (
  <ConditionalLink condition={Boolean(url)} href={url}>
    <ImageWithFallback
      src={PersonImage({ path: imageSrc, size: "sm" })}
      width={170}
      height={240}
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
  </ConditionalLink>
);

export default PersonPoster;
