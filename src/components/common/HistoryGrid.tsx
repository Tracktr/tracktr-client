import { EpisodesHistory, MoviesHistory } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { PosterImage } from "../../utils/generateImages";
import LoadingPageComponents from "./LoadingPageComponents";
import PosterGrid from "./PosterGrid";
import { CgTrash } from "react-icons/cg";

interface IHistoryGrid {
  history: (MoviesHistory | EpisodesHistory)[];
  status: "error" | "success" | "loading";
  handleDelete: (id: string, type: "movie" | "episode") => void;
}

const HistoryGrid = ({ history, status, handleDelete }: IHistoryGrid): JSX.Element => {
  if (history.length < 1 && status !== "loading") {
    return <div>No history found, start watching some shows and movies!</div>;
  }

  return (
    <LoadingPageComponents status={status} posters>
      {() => (
        <PosterGrid>
          {history.map((item: any) => {
            const date = new Date(item.datetime).toLocaleString("en-UK", {
              dateStyle: "medium",
              timeStyle: "short",
            });

            return (
              <div className="relative w-[170px] group" key={item.id}>
                <Link
                  href={
                    item?.movie_id
                      ? `/movies/${item.movie.id}`
                      : `/tv/${item.series_id}/season/${item.season_number}/episode/${item.episode_number}`
                  }
                >
                  <a>
                    <Image
                      alt={`Poster image for ${
                        item?.movie_id
                          ? item.movie.title
                          : `${item.season_number}x${item.episode_number} ${item.series.name}`
                      }`}
                      src={PosterImage({
                        path: item.movie_id ? item.movie.poster : item.series.poster,
                        size: "sm",
                      })}
                      width="170px"
                      height="240px"
                      className="rounded"
                    />
                  </a>
                </Link>
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden bg-gradient-to-t from-primaryBackground">
                  <Link
                    href={
                      item?.movie_id
                        ? `/movies/${item.movie.id}`
                        : `/tv/${item.series_id}/season/${item.season_number}/episode/${item.episode_number}`
                    }
                  >
                    <a>
                      <div className="px-4 py-2">
                        <span className="w-full text-sm line-clamp-2">
                          {item?.movie_id
                            ? `${item.movie.title}`
                            : `${item.season_number}x${item.episode_number} ${item.series.name}`}
                        </span>
                        <div className="text-xs line-clamp-1">{date}</div>
                      </div>
                    </a>
                  </Link>
                  <button
                    className="flex justify-center w-full text-3xl text-red-500 hover:text-red-600 max-h-0 group-hover:max-h-10 transistion-[max-height]"
                    onClick={() => handleDelete(item.id, item.movie_id ? "movie" : "episode")}
                  >
                    <CgTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </PosterGrid>
      )}
    </LoadingPageComponents>
  );
};

export default HistoryGrid;
