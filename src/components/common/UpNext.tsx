import Image from "next/image";
import Link from "next/link";
import { PosterImage } from "../../utils/generateImages";
import LoadingPageComponents from "./LoadingPageComponents";
import { PosterGrid, PosterGridWithScrollContainer } from "./PosterGrid";
import { Episodes } from "@prisma/client";

interface IepisodesGrid {
  episodes: Episodes[];
  status: "error" | "success" | "loading";
}

const UpNext = ({ episodes, status }: IepisodesGrid): JSX.Element => {
  if (episodes.length < 1 && status !== "loading") {
    return (
      <div>
        You have finished all your shows, go check out some{" "}
        <Link href="/tv">
          <a className="underline">new ones!</a>
        </Link>
      </div>
    );
  }

  return (
    <LoadingPageComponents status={status} posters>
      {() => (
        <PosterGridWithScrollContainer>
          {episodes.map((item: any) => {
            return (
              <div className="relative w-[170px] group" key={item.id}>
                <Link href={`/tv/${item.series.id}/season/${item.season_number}/episode/${item.episode_number}`}>
                  <a className="relative w-[170px] group">
                    <Image
                      alt={`Poster image for ${item.season_number}x${item.episode_number} ${item.series.name}`}
                      src={PosterImage({
                        path: item.series.poster,
                        size: "sm",
                      })}
                      width="170px"
                      height="240px"
                      className="rounded"
                    />
                    <div className="absolute bottom-0 left-0 right-0 overflow-hidden text-sm font-bold text-center bg-gradient-to-t from-primaryBackground">{`S${item.season_number} - E${item.episode_number}`}</div>
                  </a>
                </Link>
              </div>
            );
          })}
        </PosterGridWithScrollContainer>
      )}
    </LoadingPageComponents>
  );
};

export default UpNext;
