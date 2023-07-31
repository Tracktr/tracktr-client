import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { PosterImage } from "../../utils/generateImages";
import { motion } from "framer-motion";
import ImageWithFallback from "../common/ImageWithFallback";

function groupBy<T extends Record<string, any>, K extends keyof T>(
  array: T[],
  key: K | { (obj: T): string }
): Record<string, T[]> {
  const keyFn = key instanceof Function ? key : (obj: T) => obj[key];
  return array.reduce((objectsByKeyValue, obj) => {
    const value = keyFn(obj);
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {} as Record<string, T[]>);
}

const CreditsBlock = ({ credits }: CreditsBlockProps) => {
  const movieCreditsByJob = Object.entries(groupBy(credits.movie.crew, "job")).map(([title, data]) => ({
    title,
    data,
  }));
  const tvCreditsByJob = Object.entries(groupBy(credits.tv.crew, "job")).map(([title, data]) => ({
    title,
    data,
  }));

  return (
    <div>
      <h2 className="pb-8 text-5xl font-bold">Known for</h2>
      <h3 className="pb-4 text-3xl">Movies</h3>
      <DetailsBlock data={credits.movie.cast} type="movies" name="Acting" />
      {movieCreditsByJob.map((job, index) => {
        return <DetailsBlock type="movies" key={index} data={job.data} name={job.title} />;
      })}

      <h3 className="pb-4 mt-12 text-3xl">TV</h3>
      <DetailsBlock data={credits.tv.cast} type="tv" name="Acting" />
      {tvCreditsByJob.map((job, index) => {
        return <DetailsBlock type="tv" key={index} data={job.data} name={job.title} />;
      })}
    </div>
  );
};

interface DetailsBlockProps {
  data: any;
  type: "movies" | "tv";
  name: string;
}

const DetailsBlock = ({ data, type, name }: DetailsBlockProps) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="mb-4 border-2 rounded-md border-zinc-800">
      <button onClick={() => setShowMore(!showMore)} className="flex items-center justify-between w-full p-4 text-2xl">
        <h2 className="text-xl md:text-2xl">
          {name} <span className="text-sm">{data.length}</span>
        </h2>
        <motion.div
          animate={{
            rotate: showMore ? 90 : 0,
          }}
        >
          <MdKeyboardArrowRight />
        </motion.div>
      </button>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: showMore ? "auto" : 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {data
          .sort(
            (
              a: { release_date: number; first_air_date: number },
              b: { release_date: number; first_air_date: number }
            ) =>
              new Date(b.release_date || b.first_air_date || 0).setHours(0, 0, 0, 0) -
              new Date(a.release_date || a.first_air_date || 0).setHours(0, 0, 0, 0)
          )
          .map((cast: any, index: any) => (
            <Link href={`/${type}/${cast.id}`} key={index} className="flex justify-end px-4">
              <div className="flex py-2 mr-auto">
                <div className="flex-shrink-0 pr-4">
                  <ImageWithFallback
                    alt={"Poster for: " + cast.title || cast.name}
                    src={PosterImage({ path: cast.poster_path, size: "sm" })}
                    width={50}
                    height={75}
                  />
                </div>
                <div className="flex flex-col shrink">
                  <p className="pt-2">{cast.title || cast.name}</p>
                  <p className="text-sm">{cast.character}</p>
                </div>
              </div>
              <div className="flex items-center w-1/6 shrink-0">
                <p className="text-sm">{cast.release_date || cast.first_air_date}</p>
              </div>
            </Link>
          ))}
      </motion.div>
    </div>
  );
};

interface Cast {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  character: string;
  credit_id: string;
}

interface Crew {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  credit_id: string;
  department: string;
  job: string;
}

interface CreditsBlockProps {
  credits: {
    movie: {
      cast: Cast[] & {
        original_title: string;
        release_date: string;
        title: string;
        video: boolean;
        order: number;
      };
      crew: Crew[] & {
        original_title: string;
        release_date: string;
        title: string;
        video: boolean;
      };
    };
    tv: {
      cast: Cast[] & {
        origin_country: string[];
        original_name: string;
        first_air_date: string;
        name: string;
        episode_count: number;
      };
      crew: Crew[] & {
        origin_country: string[];
        original_name: string;
        first_air_date: string;
        name: string;
        episode_count: number;
      };
    };
  };
}

export default CreditsBlock;
