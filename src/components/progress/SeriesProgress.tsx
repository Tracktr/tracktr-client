import Link from "next/link";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";
import { IoIosAdd, IoMdInformation } from "react-icons/io";
import { toast } from "react-toastify";
import { PosterImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";
import ImageWithFallback from "../common/ImageWithFallback";
import { IThemeColor } from "../watchButton/BaseWatchButton";
import { motion } from "framer-motion";

const SeriesProgress = ({
  name,
  imageSrc,
  url,
  number_of_episodes,
  episodes_watched,
  nextEpisode,
  themeColor,
  seriesID,
  episodeID,
  refetch,
}: {
  name: string;
  imageSrc: string;
  url: string;
  number_of_episodes: number;
  episodes_watched: number;
  nextEpisode: {
    id: number;
    name: string;
    episode_number: number;
    season_number: number;
    seasons_id: number;
    datetime: Date;
  };
  themeColor: IThemeColor;
  seriesID: number;
  episodeID: number;
  refetch: () => void;
}) => {
  const percent = Math.ceil((episodes_watched / number_of_episodes) * 100);
  const markAsWatched = trpc.episode.markEpisodeAsWatched.useMutation({
    onSuccess: () => {
      toast(`Marked ${name} episode ${nextEpisode.episode_number} as watched`, {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      refetch();
    },
    onError: () => {
      toast("Failed to mark episode as watched", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -150, opacity: 0 }}
      transition={{ type: "spring" }}
      className="flex flex-col gap-2 mx-4 md:flex-row group"
    >
      <Link href={url} className="flex justify-center md:block">
        <ImageWithFallback
          alt={"Poster for" + name}
          src={PosterImage({ path: imageSrc, size: "md" })}
          width={150}
          height={450}
          className="rounded-t rounded-b md:rounded-b-none"
        />
        <div className="hidden md:flex bg-[#343434] rounded-b-full">
          <span
            className="h-4 duration-300 ease-in-out rounded-b-full tra8sition-all bg-primary"
            style={{
              width: `${percent}%`,
            }}
          />
        </div>
      </Link>

      <div className="md:hidden flex bg-[#343434] rounded-full">
        <span
          className={`h-6 ${
            percent > 10 ? "text-black" : "text-white"
          } transition-all duration-300 ease-in-out rounded-full bg-primary`}
          style={{
            width: `${Math.ceil((episodes_watched / number_of_episodes) * 100)}%`,
          }}
        >
          <span className="pl-4">{percent}%</span>
        </span>
      </div>

      <div>
        <Link href={url} className="text-xl font-bold">
          {name}
        </Link>
        <div>
          Watched <span className="font-bold">{episodes_watched}</span> of{" "}
          <span className="font-bold">{number_of_episodes}</span> episodes{" "}
          <span className="hidden md:inline-block">({percent}%)</span>, leaving{" "}
          <span className="font-bold">{number_of_episodes - episodes_watched}</span> episodes left to watch. Last
          episode watched on{" "}
          {nextEpisode.datetime &&
            nextEpisode.datetime.toLocaleString("en-UK", {
              dateStyle: "long",
              timeStyle: "medium",
            })}
          .
        </div>
        <div className="mt-4">
          <div>Up next:</div>
          <Link
            href={`${url}/season/${nextEpisode.season_number}/episode/${nextEpisode.episode_number}`}
            className="flex items-center mt-1"
          >
            <span
              style={{
                background: themeColor?.hex,
              }}
              className={`
                  px-3 py-1 mr-2 rounded-full
                  ${themeColor.isDark && "text-white"}
                  ${themeColor.isLight && "text-primaryBackground"}
                `}
            >
              {nextEpisode.season_number}x{nextEpisode.episode_number}
            </span>
            {nextEpisode.name}
          </Link>
          <div className="flex pt-1 mt-auto mb-4">
            <button
              disabled={markAsWatched.isPending}
              className="text-2xl transition-all duration-300 ease-in-out "
              onClick={() => {
                markAsWatched.mutate({
                  episodeID,
                  seriesID,
                });
              }}
            >
              {markAsWatched.isPending ? (
                <ImSpinner2 className="w-6 h-6 animate-spin" />
              ) : (
                <AiOutlineCheckCircle className="text-gray-500 text-opacity-100 hover:text-green-500" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SeriesProgress;
