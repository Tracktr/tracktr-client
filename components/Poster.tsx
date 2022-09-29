import Image from 'next/image';

export interface IPoster {
  imageSrc: string;
  name: string;
}

const Poster = ({ imageSrc, name }: IPoster) => {
  return (
    <div>
      <Image src={imageSrc} width="170px" height="240px" className="rounded" />
      <div className="text-xs">{name}</div>
    </div>
  );
};

export default Poster;
