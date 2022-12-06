import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { PosterImage } from "../../utils/generateImages";
import { motion } from "framer-motion";

interface CreditsBlockProps {
  credits: any;
}

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

  console.log(movieCreditsByJob, tvCreditsByJob);

  return (
    <div>
      <h2 className="pb-4 text-3xl font-bold">Known for</h2>
      <DetailsBlock data={credits.movie.cast} type="movies" name="Movies" />
      <DetailsBlock data={credits.tv.cast} type="tv" name="TV" />
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
      <button onClick={() => setShowMore(!showMore)} className="flex items-center justify-between w-full p-4 text-2xl ">
        <h2>
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
              new Date(a.release_date || a.first_air_date).setHours(0, 0, 0, 0) -
              new Date(b.release_date || b.first_air_date).setHours(0, 0, 0, 0)
          )
          .reverse()
          .map((cast: any) => (
            <Link href={`/${type}/${cast.id}`} key={cast.id}>
              <a className="flex justify-between px-4">
                <div className="flex py-2">
                  <div className="pr-4">
                    <Image
                      alt={"Poster for: " + cast.title || cast.name}
                      src={PosterImage({ path: cast.poster_path, size: "sm" })}
                      width={50}
                      height={75}
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="pt-2">{cast.title || cast.name}</p>
                    <p className="text-sm">{cast.character}</p>
                  </div>
                </div>
                <div className="self-center">
                  <p className="text-sm">{cast.release_date || cast.first_air_date}</p>
                </div>
              </a>
            </Link>
          ))}
      </motion.div>
    </div>
  );
};

export default CreditsBlock;
