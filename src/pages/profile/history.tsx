import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import { trpc } from "../../utils/trpc";

const ProfilePage = () => {
  const router = useRouter();
  const session = useSession();
  const { data, status } = trpc.profile.watchHistory.useQuery();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  });

  useEffect(() => {
    const episodes = data?.EpisodesHistory || [];
    const movies = data?.MoviesHistory || [];

    setHistory([...episodes, ...movies]);
  }, [data]);

  return (
    <LoadingPageComponents status={status}>
      {() => (
        <div className="max-w-6xl m-auto">
          <ProfileHeader image={data?.image} name={data?.name} />
          <div className="grid grid-cols-6 gap-2 my-6 text-center">
            {history
              .sort((a, b) => {
                if (a.datetime < b.datetime) {
                  return 1;
                } else {
                  return -1;
                }
              })
              .map((item) => {
                const date = new Date(item.datetime).toLocaleString(
                  "en-UK", // TODO: get time format from user language
                  {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }
                );

                return (
                  <div key={item.id}>
                    <div className="text-sm truncate">
                      {item?.series
                        ? `${item.season_number}x${item.episode_number} ${item.series.name}`
                        : `${item.movie.title}`}
                    </div>
                    <div className="text-xs">{date}</div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </LoadingPageComponents>
  );
};

export default ProfilePage;
