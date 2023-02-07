import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosAdd, IoIosRemove, IoMdInformation } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import FriendReview from "../../components/common/FriendReviews";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { trpc } from "../../utils/trpc";

const AdminPage = () => {
  const [currentLoadingID, setCurrentLoadingID] = useState("");
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

  useEffect(() => {
    if (sessionStatus !== "loading" && sessionData?.user?.profile?.role !== "ADMIN") {
      router.push("/");
    }
  });

  return (
    <>
      <Head>
        <title>Admin - Tracktr.</title>
      </Head>

      <LoadingPageComponents status={isLoading ? "loading" : "success"}>
        {() => (
          <div className="max-w-6xl px-4 pt-24 m-auto">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="md:w-[50%] bg-[#1A1A1A] p-4 rounded">
                <div className="text-xl font-bold">Stats</div>
                <div>
                  {stats?.newUsersCount || 0} new users in the past week ({stats?.userCount || 0} in total)
                </div>
                <div>
                  In total, users watched {stats?.episodesWatched || 0} episodes and {stats?.moviesWatched || 0} movies
                  in the past week.
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
              <div className="md:w-[50%] bg-[#1A1A1A] p-4 rounded">
                <div className="text-xl font-bold">Movie reviews</div>
                {reviews && reviews.movies && reviews.movies.length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {reviews.movies.map((review) => (
                      <div key={review.id}>
                        <FriendReview
                          content={review.content}
                          created={review.created}
                          friend={{
                            image: review.user.image,
                            name: review.user.profile?.username,
                          }}
                          item={review.Movies}
                          hideImage
                        />
                        <button className="w-full px-2 py-1 mr-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:outline-none sm:w-auto hover:bg-blue-700 focus:ring-blue-800 disabled:cursor-not-allowed disabled:bg-gray-700">
                          Approve
                        </button>
                        <button
                          className="w-full px-2 py-1 text-sm font-medium text-center text-white bg-red-600 rounded-lg focus:ring-4 focus:outline-none sm:w-auto hover:bg-red-700 focus:red-blue-800 disabled:cursor-not-allowed disabled:bg-gray-700"
                          onClick={() => {
                            setCurrentLoadingID(review.id);
                            removeMoviesReview.mutate({
                              reviewID: review.id,
                            });
                          }}
                        >
                          {removeMoviesReview.isLoading && currentLoadingID === review.id ? (
                            <div className="flex items-center gap-2">
                              <ImSpinner2 className="animate-spin" />
                            </div>
                          ) : (
                            <div>Remove</div>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>No movie reviews</div>
                )}
              </div>

              <div className="md:w-[50%] bg-[#1A1A1A] p-4 rounded">
                <div className="text-xl font-bold">Series reviews</div>
                {reviews && reviews.series && reviews.series.length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {reviews.series.map((review) => (
                      <div key={review.id}>
                        <FriendReview
                          content={review.content}
                          created={review.created}
                          friend={{
                            image: review.user.image,
                            name: review.user.profile?.username,
                          }}
                          item={review.Series}
                          hideImage
                        />

                        <button className="w-full px-2 py-1 mr-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:outline-none sm:w-auto hover:bg-blue-700 focus:ring-blue-800 disabled:cursor-not-allowed disabled:bg-gray-700">
                          Approve
                        </button>
                        <button
                          className="w-full px-2 py-1 text-sm font-medium text-center text-white bg-red-600 rounded-lg focus:ring-4 focus:outline-none sm:w-auto hover:bg-red-700 focus:red-blue-800 disabled:cursor-not-allowed disabled:bg-gray-700"
                          onClick={() => {
                            setCurrentLoadingID(review.id);
                            removeSeriesReview.mutate({
                              reviewID: review.id,
                            });
                          }}
                        >
                          {removeSeriesReview.isLoading && currentLoadingID === review.id ? (
                            <div className="flex items-center gap-2">
                              <ImSpinner2 className="animate-spin" />
                            </div>
                          ) : (
                            <div>Remove</div>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>No series reviews</div>
                )}
              </div>
            </div>
          </div>
        )}
      </LoadingPageComponents>
    </>
  );
};

export default AdminPage;
