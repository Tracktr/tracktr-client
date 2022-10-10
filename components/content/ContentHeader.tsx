import { PosterImage } from "@/utils/generateImages";
import Image from "next/image";

interface IContentHeader {
  cover: string;
  poster: string;
  title: string;
  date?: string;
  description: string;
  children?: any;
}

const ContentHeader = ({ cover, poster, title, date, description, children }: IContentHeader) => (
  <>
    <div
      className="absolute w-screen max-w-full h-64 md:h-[32rem] top-0 left-0"
      style={{
        background: `url("https://www.themoviedb.org/t/p/original${cover}") no-repeat`,
        backgroundSize: "cover",
      }}
    >
      <div className="relative w-full h-full bg-gradient-to-t from-primaryBackground" />
    </div>

    <div className="relative w-full">
      <div className="grid max-w-6xl grid-cols-4 pt-24 m-auto md:pt-96">
        <div className="col-span-1 mx-4 text-center">
          <div className="inline-block border-4 rounded-md border-primaryBackground">
            <Image width="208" height="311" src={PosterImage({ path: poster, size: "lg" })} />
          </div>
        </div>

        <div className="col-span-3">
          <h1 className="pt-6 text-3xl font-black md:text-6xl drop-shadow-lg">
            {title}
            {date && <span className="ml-4 text-xl opacity-75 md:text-4xl drop-shadow-md">{date.slice(0, 4)}</span>}
          </h1>
          <p className="max-w-xl pt-8 pb-12">{description}</p>

          {children || ""}
        </div>
      </div>
    </div>
  </>
);

export default ContentHeader;
