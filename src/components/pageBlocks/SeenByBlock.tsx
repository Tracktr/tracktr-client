import { Episodes, EpisodesHistory, Movies, MoviesHistory, Profile, Seasons, Series, User } from "@prisma/client";
import Link from "next/link";
import ImageWithFallback from "../common/ImageWithFallback";

const SeenByBlock = ({
  data,
}: {
  data:
    | (User & {
        profile: Profile | null;
        EpisodesHistory: (EpisodesHistory & { series: Series; season: Seasons; episode: Episodes })[];
      })[]
    | (User & {
        profile: Profile | null;
        MoviesHistory: (MoviesHistory & { movie: Movies })[];
      })[]
    | undefined;
}) => {
  return (
    <div className="relative mx-1 mb-8 md:mx-0">
      <h2 className="pb-4 text-4xl font-bold">Seen by</h2>
      <div className="flex gap-4 mb-5">
        {data && data.length > 0 ? (
          data.map((user) => {
            return (
              <Link href={`/profile/${user.profile?.username}`} key={user.name}>
                <a className="flex flex-col items-center">
                  <ImageWithFallback
                    src={user.image}
                    fallbackSrc="/placeholder_profile.png"
                    width="64"
                    height="64"
                    alt="Profile picture"
                    className="rounded-full"
                  />
                  <p className="text-sm">{user.profile?.username}</p>
                </a>
              </Link>
            );
          })
        ) : (
          <div>No one you are following has seen this yet!</div>
        )}
      </div>
    </div>
  );
};

export default SeenByBlock;
