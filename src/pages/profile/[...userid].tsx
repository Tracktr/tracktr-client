import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ImSpinner2 } from "react-icons/im";
import { MdOutlineWrapText } from "react-icons/md";
import HistoryGrid from "../../components/common/HistoryGrid";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import { PosterImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";
import { AnimatePresence, motion } from "framer-motion";
import { PosterGrid } from "../../components/common/PosterGrid";

const PublicProfile = () => {
  const router = useRouter();
  const session = useSession();

  const {
    data: profile,
    status: profileStatus,
    refetch,
    isRefetching,
  } = trpc.profile.profileById.useQuery(
    {
      user: String(router.query.userid),
    },
    { enabled: router.isReady }
  );

  const addAsFriend = trpc.profile.createFriend.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const removeAsFriend = trpc.profile.removeFriend.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <LoadingPageComponents status={profileStatus}>
      {() => (
        <div className="max-w-6xl m-auto">
          <ProfileHeader image={String(profile?.image)} name={String(profile?.name)} />

          {session.status === "authenticated" && session?.data?.user?.id !== profile?.id && (
            <button
              className="inline-flex items-center px-6 py-4 mt-6 font-semibold text-black transition-all duration-200 rounded-full bg-primary lg:mt-16"
              role="button"
              onClick={() => {
                if (profile?.friends?.length !== 1) {
                  addAsFriend.mutate({ friend: String(profile?.id) });
                }
                removeAsFriend.mutate({ friend: String(profile?.id) });
              }}
              disabled={addAsFriend.isLoading || removeAsFriend.isLoading}
            >
              {addAsFriend.isLoading || removeAsFriend.isLoading || isRefetching ? (
                <div className="flex gap-4">
                  <ImSpinner2 className="w-6 h-6 animate-spin" />
                  Loading
                </div>
              ) : profile?.friends?.length === 1 ? (
                <div>Remove as friends</div>
              ) : (
                <div>Add as friend</div>
              )}
            </button>
          )}

          <div className="mt-12 mb-6">
            <div className="flex items-center text-xl align-middle mb-7 md:text-3xl">
              <MdOutlineWrapText className="mr-4" />
              <div>Recently watched episodes</div>
            </div>
            <HistoryGrid
              hasScrollContainer
              history={profile?.EpisodesHistory || []}
              status={profileStatus}
              refetch={refetch}
              inPublic={true}
            />
          </div>
          <div className="my-6">
            <div className="flex items-center text-xl align-middle mb-7 md:text-3xl">
              <MdOutlineWrapText className="mr-4" />
              <div>Recently watched movies</div>
            </div>
            <HistoryGrid
              hasScrollContainer
              history={profile?.MoviesHistory || []}
              status={profileStatus}
              refetch={refetch}
              inPublic={true}
            />
          </div>
          <div className="my-6">
            <div className="flex items-center text-xl align-middle mb-7 md:text-3xl">
              <MdOutlineWrapText className="mr-4" />
              <div>Watchlist</div>
            </div>
            <PosterGrid hasScrollContainer>
              <AnimatePresence mode="popLayout" initial={false}>
                {profile?.Watchlist &&
                profile.Watchlist[0]?.WatchlistItem &&
                profile.Watchlist[0]?.WatchlistItem.length > 0 ? (
                  profile.Watchlist[0]?.WatchlistItem.map((item: any) => {
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -150, opacity: 0 }}
                        transition={{ type: "spring" }}
                        className="relative w-[170px] group"
                        key={item.id}
                      >
                        <Link href={item?.movie_id ? `/movies/${item.movie_id}` : `/tv/${item.series_id}`}>
                          <a className="relative w-[170px] group">
                            <Image
                              alt={`Poster image for ${item?.movie_id ? item.movies?.title : item.series?.name}`}
                              src={PosterImage({
                                path: item.movie_id ? String(item.movies?.poster) : String(item.series?.poster),
                                size: "sm",
                              })}
                              width="170px"
                              height="240px"
                              className="rounded"
                            />
                            <div>
                              <span className="w-full text-xs truncate line-clamp-2">
                                {item?.movie_id ? item.movies?.title : item.series?.name}
                              </span>
                            </div>
                          </a>
                        </Link>
                      </motion.div>
                    );
                  })
                ) : (
                  <div>No items found.</div>
                )}
              </AnimatePresence>
            </PosterGrid>
          </div>
        </div>
      )}
    </LoadingPageComponents>
  );
};

export default PublicProfile;
