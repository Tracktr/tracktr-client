import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { IoIosAdd, IoIosRemove, IoMdInformation } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import ApproveReview from "../../components/admin/ApproveReview";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { trpc } from "../../utils/trpc";

const AdminPage = () => {
  const { status: sessionStatus, data: sessionData } = useSession();
  const router = useRouter();

  const { data: stats, isLoading } = trpc.admin.stats.useQuery(
    { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { enabled: sessionStatus === "authenticated" }
  );

  const { data: feedback, refetch: refetchFeedback } = trpc.feedback.get.useQuery(undefined, {
    enabled: sessionStatus === "authenticated",
  });
  const removeFeedback = trpc.feedback.delete.useMutation({
    onSuccess: () => {
      toast("Feedback Removed", {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      refetchFeedback();
    },
    onError: () => {
      toast("Failed to remove feedback", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const { data: reviews, refetch: refetchReviews } = trpc.admin.getReviews.useQuery(undefined, {
    enabled: sessionStatus === "authenticated",
  });

  const removeMoviesReview = trpc.admin.removeMovieReview.useMutation({
    onSuccess: () => {
      toast(`Removed review`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
      refetchReviews();
    },
    onError: () => {
      toast("Failed to remove review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });
  const removeSeriesReview = trpc.admin.removeSeriesReview.useMutation({
    onSuccess: () => {
      toast(`Removed review`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
      refetchReviews();
    },
    onError: () => {
      toast("Failed to remove review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });
  const removeSeasonsReview = trpc.admin.removeSeasonsReview.useMutation({
    onSuccess: () => {
      toast(`Removed review`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
      refetchReviews();
    },
    onError: () => {
      toast("Failed to remove review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });
  const removeEpisodesReview = trpc.admin.removeEpisodesReview.useMutation({
    onSuccess: () => {
      toast(`Removed review`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
      refetchReviews();
    },
    onError: () => {
      toast("Failed to remove review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const approveMoviesReview = trpc.admin.approveMoviesReview.useMutation({
    onSuccess: () => {
      toast(`Approved review`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
      refetchReviews();
    },
    onError: () => {
      toast("Failed to approve review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });
  const approveSeriesReview = trpc.admin.approveSeriesReview.useMutation({
    onSuccess: () => {
      toast(`Approved review`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
      refetchReviews();
    },
    onError: () => {
      toast("Failed to approve review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });
  const approveSeasonsReview = trpc.admin.approveSeasonsReview.useMutation({
    onSuccess: () => {
      toast(`Approved review`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
      refetchReviews();
    },
    onError: () => {
      toast("Failed to approve review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });
  const approveEpisodesReview = trpc.admin.approveEpisodesReview.useMutation({
    onSuccess: () => {
      toast(`Approved review`, {
        icon: <IoIosRemove className="text-3xl text-red-500" />,
      });
      refetchReviews();
    },
    onError: () => {
      toast("Failed to approve review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  useEffect(() => {
    if (sessionStatus !== "loading" && sessionData?.user?.profile?.role !== "ADMIN") {
      router.push("/404");
    }
  });

  return (
    <>
      <Head>
        <title>Admin - Tracktr.</title>
      </Head>

      <LoadingPageComponents status={isLoading ? "loading" : "success"}>
        {() => (
          <div className="max-w-6xl px-4 pt-24 pb-4 m-auto">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="md:w-[50%] bg-[#1A1A1A] p-4 rounded">
                <div className="text-xl font-bold">Stats</div>
                <div>
                  {stats?.newUsersCount || 0} new users in the past week ({stats?.userCount || 0} in total)
                </div>
                <div>
                  In total, {stats?.uniqueEpisodeViewers || 0} user(s) watched {stats?.episodesWatched || 0} episodes
                  and {stats?.uniqueMovieViewers || 0} user(s) watched {stats?.moviesWatched || 0} movies in the past
                  week. They also left {stats?.reviewCount || 0} reviews.
                </div>
              </div>

              <div className="md:w-[50%] bg-[#1A1A1A] p-4 rounded">
                <div className="text-xl font-bold">Feedback</div>
                {feedback && feedback.length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {feedback.map((item) => (
                      <div key={item.id}>
                        <p className="text-sm">
                          <a href={`mailto:${item.email}`}>{item.email}</a> wrote on{" "}
                          {item.created.toLocaleString("en-UK", {
                            dateStyle: "medium",
                          })}
                          :
                        </p>
                        <div className="flex">
                          <div>{item.message}</div>
                          <button
                            className="ml-auto text-3xl transition-all duration-300 ease-in-out hover:text-red-700"
                            onClick={() =>
                              removeFeedback.mutate({
                                id: item.id,
                              })
                            }
                          >
                            <MdDelete className="text-xl" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>No feedback</div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-4 md:flex-row">
              <ApproveReview
                approveItem={approveMoviesReview}
                removeItem={removeMoviesReview}
                type="movie"
                reviews={reviews?.movies}
              />
              <ApproveReview
                approveItem={approveSeriesReview}
                removeItem={removeSeriesReview}
                type="series"
                reviews={reviews?.series}
              />
            </div>

            <div className="flex flex-col gap-4 mt-4 md:flex-row">
              <ApproveReview
                approveItem={approveSeasonsReview}
                removeItem={removeSeasonsReview}
                type="season"
                reviews={reviews?.seasons}
              />
              <ApproveReview
                approveItem={approveEpisodesReview}
                removeItem={removeEpisodesReview}
                type="episodes"
                reviews={reviews?.episodes}
              />
            </div>
          </div>
        )}
      </LoadingPageComponents>
    </>
  );
};

export default AdminPage;
