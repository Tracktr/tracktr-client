import Image from "next/image";
import { FaHeart, FaStar } from "react-icons/fa";

interface IContentHeader {
  cover: String;
  poster: String;
  title: String;
  date: String;
  audienceScore: String;
  imdbScore: String;
}

const ContentHeader = ({ cover, poster, title, date, audienceScore, imdbScore }: IContentHeader) => (
  <>
    <div
      className="relative w-screen h-[32rem] blur-sm"
      style={{
        backgroundSize: "cover",
        background: `url("${cover}")`,
      }}
    />
    <div className="relative w-screen h-16 bottom-2 bg-primaryBackground" />

    <div className="absolute top-0 w-full">
      <div className="flex max-w-6xl m-auto pt-96">
        <div className="border-4 rounded-md border-primaryBackground">
          <Image width="208" height="311" src={`${poster}`} />
        </div>

        <h1 className="pt-10 pl-6 text-6xl font-black drop-shadow-lg">
          {title}
          <span className="ml-4 text-4xl opacity-75 drop-shadow-md">{date}</span>
        </h1>

        <div className="flex h-full p-3 mt-8 ml-auto space-x-4 font-medium text-center bg-opacity-50 rounded-md bg-primaryBackground">
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
