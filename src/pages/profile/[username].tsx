import { useSession } from "next-auth/react";
import Image from "next/image";
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
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../server/trpc/router/_app";
import { createContext } from "../../server/trpc/context";
import SuperJSON from "superjson";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

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

          <div className="max-w-6xl m-auto">
            <ProfileHeader image={String(profile?.image)} name={String(profile?.profile?.username)} />

            {session.status === "authenticated" && session?.data?.user?.id !== profile?.id && (
              <button
                className="inline-flex items-center px-6 py-4 mt-6 font-semibold text-black transition-all duration-200 rounded-full bg-primary lg:mt-16"
                onClick={() => {
                  if (profile?.followers?.length !== 1) {
                    addAsFollower.mutate({ follower: String(profile?.id) });
                  }
                  removeAsFollower.mutate({ follower: String(profile?.id) });
                }}
                disabled={addAsFollower.isLoading || removeAsFollower.isLoading}
              >
                {addAsFollower.isLoading || removeAsFollower.isLoading || isRefetching ? (
                  <div className="flex gap-4">
                    <ImSpinner2 className="w-6 h-6 animate-spin" />
                    Loading
                  </div>
                ) : profile?.followers?.length === 1 ? (
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
            <div className="mt-6 mb-12">
              <div className="flex items-center text-xl align-middle mb-7 md:text-3xl">
                <MdOutlineWrapText className="mr-4" />
                <div>Recent reviews</div>
              </div>

              {(profile?.SeriesReviews && profile?.SeriesReviews.length > 0) ||
              (profile?.MoviesReviews && profile?.MoviesReviews.length > 0) ? (
                <div>
                  {profile?.SeriesReviews[0] && (
                    <Link href={`/tv/${profile?.SeriesReviews[0]?.Series.id}#reviews`}>
                      <a>
                        <div className="flex items-center gap-2 mb-4">
                          <Image
                            alt={"Poster image for:" + profile?.SeriesReviews[0]?.Series.name}
                            width="100"
                            height="150"
                            src={PosterImage({ path: profile?.SeriesReviews[0]?.Series.poster, size: "lg" })}
                          />
                          <div>
                            <p className="text-xl">{profile?.SeriesReviews[0]?.Series.name}</p>
                            <div className="mb-4 text-sm">
                              {profile.SeriesReviews[0].created.toLocaleString("en-UK", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </div>
                            <div>{profile.SeriesReviews[0].content}</div>
                          </div>
                        </div>
                      </a>
                    </Link>
                  )}
                  {profile?.MoviesReviews[0] && (
                    <Link href={`/movies/${profile?.MoviesReviews[0]?.Movies.id}#reviews`}>
                      <a>
                        <div className="flex items-center gap-2 mb-4">
                          <Image
                            alt={"Poster image for:" + profile?.MoviesReviews[0]?.Movies.title}
                            width="100"
                            height="150"
                            src={PosterImage({ path: profile?.MoviesReviews[0]?.Movies.poster, size: "lg" })}
                          />
                          <div>
                            <p className="text-xl">{profile?.MoviesReviews[0]?.Movies.title}</p>
                            <div className="mb-4 text-sm">
                              {profile.MoviesReviews[0].created.toLocaleString("en-UK", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </div>
                            <div>{profile.MoviesReviews[0].content}</div>
                          </div>
                        </div>
                      </a>
                    </Link>
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

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext({ req: context.req, res: context.res }),
    transformer: SuperJSON,
  });
  await ssg.profile.profileByUsername.prefetch({ user: context.query.username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username: context.query.username,
    },
  };
};

export default PublicProfile;
