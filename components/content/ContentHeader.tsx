import Image from "next/image";
import { FaHeart, FaStar, FaPlay } from "react-icons/fa";

interface IContentHeader {
  cover: string;
  poster: string;
  title: string;
  date: string;
  description: string;
  audienceScore: string;
  imdbScore: string;
}

const ContentHeader = ({ cover, poster, title, date, description, audienceScore, imdbScore }: IContentHeader) => (
  <>
    <div
      className="absolute w-screen h-64 md:h-[32rem] top-0 left-0"
      style={{
        backgroundSize: "cover",
        background: `url("${cover}")`,
      }}
    >
      <div className="relative w-full h-full bg-gradient-to-t from-primaryBackground" />
    </div>

    <div className="relative w-full">
      <div className="grid max-w-6xl grid-cols-4 pt-24 m-auto md:pt-96">
        <div className="col-span-1 mx-4 text-center">
          <div className="inline-block border-4 rounded-md border-primaryBackground">
            <Image width="208" height="311" src={`${poster}`} />
          </div>
          <button
            type="button"
            className="max-w-[208px] m-auto items-center justify-between hidden w-full h-12 mt-2 rounded-md md:flex bg-primary"
          >
            <span className="pl-4 font-bold">Watch Now</span>
            <FaPlay className="mr-4" />
          </button>
        </div>

        <div className="col-span-2">
          <h1 className="pt-6 text-3xl font-black md:text-6xl drop-shadow-lg">
            {title}
            <span className="ml-4 text-xl opacity-75 md:text-4xl drop-shadow-md">{date}</span>
          </h1>
          <p className="pt-8">{description}</p>
        </div>

        <div className="flex col-span-1 p-3 mt-4 ml-auto space-x-4 font-medium text-center bg-opacity-50 rounded-md h-fit bg-primaryBackground">
          <div>
            <div className="flex items-center">
              <FaHeart className="text-3xl text-red-500" />
              <p className="pl-2">{audienceScore}%</p>
            </div>
            <p className="opacity-50">audience</p>
          </div>
          <div>
            <div className="flex items-center">
              <FaStar className="text-3xl text-yellow-400" />
              <p className="pl-2">{imdbScore}/10</p>
            </div>
            <p className="opacity-50">IMDB</p>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default ContentHeader;
