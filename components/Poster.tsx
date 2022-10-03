import Image from "next/image";

export interface IPoster {
  imageSrc: string;
  name: string;
}

const Poster = ({ imageSrc, name }: IPoster) => (
  <div>
    <Image src={imageSrc} width="170px" height="240px" className="rounded" />
    <div className="text-xs max-w-[170px] px-1 truncate">{name}</div>
  </div>
);

export const BackgroundPoster = ({ imageSrc, name }: IPoster) => (
  <div>
    <div
      className="h-[180px] w-[127px] bg-cover rounded-t-lg"
      style={{
        backgroundImage: `url(${imageSrc})`,
      }}
    />

    <div className="text-xs bg-black/25 text-center py-2 rounded-b-lg">
      <div className="max-w-[127px] px-1 truncate">{name}</div>
    </div>
  </div>
);

export default Poster;
