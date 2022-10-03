import Image from "next/image";

export interface IPoster {
  imageSrc: string;
  name: string;
}

const Poster = ({ imageSrc, name }: IPoster) => (
  <div>
    <Image src={imageSrc} width="170px" height="240px" className="rounded" />
    <div className="text-xs">{name}</div>
  </div>
);

export const BackgroundPoster = ({ imageSrc, name }: IPoster) => (
  <div>
    <div
      className="h-[240px] w-[170px] bg-cover rounded-t-lg"
      style={{
        backgroundImage: `url(${imageSrc})`,
      }}
    />

    <div className="text-xs bg-black/25 text-center py-2 rounded-b-lg">
      <div>{name}</div>
    </div>
  </div>
);

export default Poster;
