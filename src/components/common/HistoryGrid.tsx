import { EpisodesHistory, MoviesHistory } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { PosterImage } from "../../utils/generateImages";
import LoadingPageComponents from "./LoadingPageComponents";
import PosterGrid from "./PosterGrid";

interface IHistoryGrid {
  history: (MoviesHistory | EpisodesHistory)[];
  status: "error" | "success" | "loading";
}

const HistoryGrid = ({ history, status }: IHistoryGrid): JSX.Element => {
  if (history.length < 1 && status !== "loading") {
    return <div>No history found, start watching some shows and movies!</div>;
  }

  return (
    <LoadingPageComponents status={status} posters>
      {() => (
        <PosterGrid>
          {history.map((item: any) => {
            const date = new Date(item.datetime).toLocaleString(
              "en-UK", // TODO: get time format from user language
              {
                dateStyle: "medium",
                timeStyle: "short",
              }
            );

            return (
              <Link
                href={
                  item?.movie_id
                    ? `/movies/${item.movie.id}`
                    : `/tv/${item.series_id}/season/${item.season_number}/episode/${item.episode_number}`
                }
                key={item.id}
              >
                <a className="w-[170px]">
                  <div className="relative">
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
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-primaryBackground">
                      <span className="w-full text-sm line-clamp-2">
                        {item?.movie_id
                          ? `${item.movie.title}`
                          : `${item.season_number}x${item.episode_number} ${item.series.name}`}
                      </span>
                      <div className="text-xs line-clamp-1">{date}</div>
                    </div>
                  </div>
                </a>
              </Link>
            );
          })}
        </PosterGrid>
      )}
    </LoadingPageComponents>
  );
};

export default HistoryGrid;
