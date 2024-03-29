import { useSession } from "next-auth/react";
import Link from "next/link";
import { ImSpinner2 } from "react-icons/im";
import { MdOutlineWrapText } from "react-icons/md";
import HistoryGrid from "../../components/common/HistoryGrid";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import ProfileHeader from "../../components/pageBlocks/ProfileHeader";
import { PosterImage } from "../../utils/generateImages";
import { trpc } from "../../utils/trpc";
import { AnimatePresence, motion } from "framer-motion";
import { PosterGrid } from "../../components/common/PosterGrid";
import Head from "next/head";
import { appRouter } from "../../server/trpc/router/_app";
import SuperJSON from "superjson";
import { InferGetServerSidePropsType } from "next";
import Review from "../../components/common/Review";
import ImageWithFallback from "../../components/common/ImageWithFallback";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createContext } from "../../server/trpc/context";

const PublicProfile = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const session = useSession();

  const {
    data: profile,
    status: profileStatus,
    refetch,
    isRefetching,
  } = trpc.profile.profileByUsername.useQuery({
    user: props.username,
  });

  const addAsFollower = trpc.followers.createFollowers.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const removeAsFollower = trpc.followers.removeFollowers.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <LoadingPageComponents status={profileStatus} notFound>
      {() => (
        <>
          <Head>
            <title>{`${profile?.profile?.username}'s Profile - Tracktr.`}</title>
            <meta property="og:image" content={String(profile?.image)} />
            <meta name="description" content={`${profile?.profile?.username} uses Tracktr to track movies and shows`} />
          </Head>

          <div className="max-w-6xl mx-2 md:m-auto">
            <ProfileHeader image={String(profile?.image)} name={String(profile?.profile?.username)} />

            {session.status === "authenticated" && session?.data?.user?.id !== profile?.id && profile?.followers && (
              <button
                className="inline-flex items-center px-6 py-4 mt-6 font-semibold text-black transition-all duration-200 rounded-full bg-primary lg:mt-16"
                onClick={() => {
                  if (profile.followers.filter((p) => p?.id === session?.data?.user?.id)) {
                    addAsFollower.mutate({ follower: String(profile?.id) });
                  }
                  removeAsFollower.mutate({ follower: String(profile?.id) });
                }}
                disabled={addAsFollower.isPending || removeAsFollower.isPending}
              >
                {addAsFollower.isPending || removeAsFollower.isPending || isRefetching ? (
                  <div className="flex gap-4">
                    <ImSpinner2 className="w-6 h-6 animate-spin" />
                    Loading
                  </div>
                ) : profile.followers.filter((p) => p?.id === session?.data?.user?.id).length === 1 ? (
                  <div>Unfollow</div>
                ) : (
                  <div>Follow</div>
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
                inPublic
                isRefetching={isRefetching}
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
                inPublic
                isRefetching={isRefetching}
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
                          <Link
                            href={item?.movie_id ? `/movies/${item.movie_id}` : `/tv/${item.series_id}`}
                            className="relative w-[170px] group"
                          >
                            <ImageWithFallback
                              alt={`Poster image for ${item?.movie_id ? item.movies?.title : item.series?.name}`}
                              src={PosterImage({
                                path: item.movie_id ? String(item.movies?.poster) : String(item.series?.poster),
                                size: "sm",
                              })}
                              width={170}
                              height={240}
                              className="rounded"
                            />
                            <div>
                              <span className="w-full text-xs truncate line-clamp-2">
                                {item?.movie_id ? item.movies?.title : item.series?.name}
                              </span>
                            </div>
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
            <div className="mt-6 mb-12">
              <div className="flex items-center text-xl align-middle mb-7 md:text-3xl">
                <MdOutlineWrapText className="mr-4" />
                <div>Recent reviews</div>
              </div>

              {(profile?.SeriesReviews && profile?.SeriesReviews.length > 0) ||
              (profile?.MoviesReviews && profile?.MoviesReviews.length > 0) ? (
                <div>
                  {profile?.SeriesReviews[0] && (
                    <Review
                      id={profile.SeriesReviews[0].id}
                      content={profile.SeriesReviews[0].content}
                      created={profile.SeriesReviews[0].created}
                      item={profile?.SeriesReviews[0]?.Series}
                    />
                  )}
                  {profile?.MoviesReviews[0] && (
                    <Review
                      id={profile.MoviesReviews[0].id}
                      content={profile.MoviesReviews[0].content}
                      created={profile.MoviesReviews[0].created}
                      item={profile?.MoviesReviews[0]?.Movies}
                    />
                  )}
                </div>
              ) : (
                <div>No reviews</div>
              )}
            </div>
          </div>
        </>
      )}
    </LoadingPageComponents>
  );
};

export async function getServerSideProps(context: any) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext({ req: context.req, res: context.res, info: context.info }),
    transformer: SuperJSON,
  });
  await helpers.profile.profileByUsername.prefetch({ user: String(context.query.username) });

  return {
    props: {
      trpcState: helpers.dehydrate(),

      username: context.query.username,
    },
  };
}

export default PublicProfile;
