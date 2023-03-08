import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";
import { IoIosAdd, IoIosRemove, IoMdInformation } from "react-icons/io";
import { MdDelete, MdEdit, MdShare } from "react-icons/md";
import { toast } from "react-toastify";
import { trpc } from "../../utils/trpc";
import ImageWithFallback from "../common/ImageWithFallback";
import Modal from "../modal/Modal";
import ModalTitle from "../modal/ModalTitle";
import { IThemeColor } from "../watchButton/BaseWatchButton";

const ReviewsBlock = ({
  reviews,
  refetchReviews,
  isRefetching,
  themeColor,
  reviewPage,
  linkedReview,
}: IReviewsBlock) => {
  const session = useSession();
  const router = useRouter();
  const MAX_MESSAGE_SIZE = 512;
  const [currentID, setCurrentID] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [input, setInput] = useState("");
  const [inputSize, setInputSize] = useState(0);
  const [inputError, setInputError] = useState("");
  const [link, setLink] = useState("");

  const removeReview = trpc.review.removeReview.useMutation({
    onSuccess: () => {
      toast("Review removed", {
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

  const editReview = trpc.review.updateReview.useMutation({
    onSuccess: () => {
      toast("Review updated", {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      refetchReviews();
      setModalOpen(false);
    },
    onError: () => {
      toast("Failed to update review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const addLike = trpc.review.addLikeReview.useMutation({
    onSuccess: () => {
      toast("Liked review", {
        icon: <IoMdInformation className="text-3xl text-green-500" />,
      });
      refetchReviews();
      setModalOpen(false);
    },
    onError: () => {
      toast("Failed to like review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const removeLike = trpc.review.deleteLikeReview.useMutation({
    onSuccess: () => {
      toast("Removed like", {
        icon: <IoMdInformation className="text-3xl text-red-500" />,
      });
      refetchReviews();
      setModalOpen(false);
    },
    onError: () => {
      toast("Failed to like review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const handleDelete = (e: any) => {
    if (e.seasons_id) {
      removeReview.mutate({ seasonID: e.seasons_id });
    } else if (e.episodes_id) {
      removeReview.mutate({ episodeID: e.episodes_id });
    } else if (e.series_id) {
      removeReview.mutate({ seriesID: e.series_id });
    } else if (e.movie_id) {
      removeReview.mutate({ movieID: e.movie_id });
    }
  };

  const handleLike = (e: any) => {
    if (e.seasons_id) {
      addLike.mutate({ id: e.id, type: "season" });
    } else if (e.episodes_id) {
      addLike.mutate({ id: e.id, type: "episode" });
    } else if (e.series_id) {
      addLike.mutate({ id: e.id, type: "series" });
    } else if (e.movie_id) {
      addLike.mutate({ id: e.id, type: "movie" });
    }
  };
  const handleDeleteLike = (e: any) => {
    if (e.seasons_id) {
      removeLike.mutate({ id: e.id, type: "season" });
    } else if (e.episodes_id) {
      removeLike.mutate({ id: e.id, type: "episode" });
    } else if (e.series_id) {
      removeLike.mutate({ id: e.id, type: "series" });
    } else if (e.movie_id) {
      removeLike.mutate({ id: e.id, type: "movie" });
    }
  };

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;

    if (value.length > MAX_MESSAGE_SIZE) {
      setInputError("Review is too long");
    } else {
      setInputError("");
    }

    setInput(value);
    setInputSize(value.length);
  };

  const onSubmit = () => {
    if (reviews[0]?.movie_id) {
      editReview.mutate({ movieID: currentID, content: input });
    } else if (reviews[0]?.series_id) {
      editReview.mutate({ seriesID: currentID, content: input });
    } else if (reviews[0]?.seasons_id) {
      editReview.mutate({ seasonID: currentID, content: input });
    } else if (reviews[0]?.episodes_id) {
      editReview.mutate({ episodeID: currentID, content: input });
    }
  };

  const handleEdit = (review: any) => {
    setCurrentID(review.movie_id || review.seasons_id || review.episodes_id || review.series_id);
    setModalOpen(!modalOpen);
    setInput(review.content);
    setInputSize(review.content.length);
  };

  useEffect(() => {
    if (router.query.movieID) {
      setLink(`/movies/${router.query.movieID}`);
    } else if (router.query.episode) {
      setLink(`/tv/${router.query.series}/season/${router.query.season}/episode/${router.query.episode}`);
    } else if (router.query.season) {
      setLink(`/tv/${router.query.series}/season/${router.query.season}`);
    } else if (router.query.series) {
      setLink(`/tv/${router.query.series}`);
    }
  }, [router.query]);

  return (
    <div className={`relative mx-1 mb-8 md:mx-0 ${reviewPage && "mt-10"}`} id="reviews">
      <div className="flex items-center justify-between gap-4 pb-4 text-4xl font-bold">
        <h2>Reviews</h2>
        <Link
          href={reviewPage ? link : `${link}/reviews`}
          className="items-center px-3 py-1 text-xs text-center rounded-full cursor-pointer bg-primary text-primaryBackground"
        >
          {reviewPage ? <>Back to detail page</> : <>Show all reviews</>}
        </Link>
      </div>
      <div className="flex flex-col gap-6">
        {isRefetching && reviews.length < 1 ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="animate-pulse w-[32px] h-[28px] rounded-full bg-[#343434]" />
              <div className="animate-pulse w-[103px] h-[28px] rounded bg-[#343434]" />
              <div className="animate-pulse w-[20px] h-[20px] rounded bg-[#343434] ml-auto" />
              <div className="animate-pulse w-[118px] h-[28px] rounded bg-[#343434]" />
            </div>
            <div className="animate-pulse w-full h-[24px] rounded bg-[#343434] mb-1" />
            <div className="animate-pulse w-full h-[24px] rounded bg-[#343434]" />
          </div>
        ) : (
          <>
            {linkedReview && (
              <Review
                key={linkedReview.id}
                review={linkedReview}
                session={session}
                link={link}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleLike={handleLike}
                handleDeleteLike={handleDeleteLike}
                linkedReview
              />
            )}
            {reviews.length > 0
              ? reviews
                  .filter((e: any) => e.id !== linkedReview?.id)
                  .map((review) => (
                    <Review
                      key={review.id}
                      review={review}
                      session={session}
                      link={link}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                      handleLike={handleLike}
                      handleDeleteLike={handleDeleteLike}
                    />
                  ))
              : !linkedReview && <div>No reviews found</div>}
          </>
        )}
      </div>

      {modalOpen && (
        <Modal handleClose={() => setModalOpen(!modalOpen)}>
          <div className="px-4 pb-4">
            <ModalTitle title="Edit review" onExit={() => setModalOpen(!modalOpen)} />
            <div className="mt-2">
              <textarea
                id="review"
                rows={4}
                value={input}
                className={`block p-2.5 w-full text-sm rounded-lg border disabled:cursor-not-allowed ${
                  inputError
                    ? "text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 bg-red-100 border-red-400"
                    : "text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 border-gray-600"
                }`}
                placeholder="Leave a review..."
                onChange={handleInput}
                disabled={editReview.isLoading}
                aria-describedby="review-helper"
              ></textarea>
              <p id="review-helper" className={`mt-2 mb-6 text-sm ${inputError ? "text-red-400" : "text-gray-400"}`}>
                {inputSize}/{MAX_MESSAGE_SIZE} characters used.
              </p>

              <button
                onClick={onSubmit}
                disabled={editReview.isLoading || Boolean(inputError)}
                style={{
                  backgroundColor: themeColor.hex,
                }}
                className={`flex items-center justify-between px-3 py-2 mt-3 rounded-md ${
                  themeColor.isDark && "text-white"
                } ${themeColor.isLight && "text-primaryBackground"} disabled:cursor-not-allowed`}
                aria-label="Submit review"
              >
                {editReview.isLoading ? (
                  <div className="flex items-center gap-3">
                    <ImSpinner2 className="animate-spin" />
                    <div>Loading</div>
                  </div>
                ) : (
                  <div>Update review</div>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Review = ({
  review,
  session,
  link,
  handleEdit,
  handleDelete,
  handleLike,
  handleDeleteLike,
  linkedReview,
}: {
  linkedReview?: boolean;
  review: any;
  session: any;
  link: string;
  handleEdit: (review: any) => void;
  handleDelete: (review: any) => void;
  handleLike: (review: any) => void;
  handleDeleteLike: (review: any) => void;
}) => {
  const userLikes =
    review.SeriesReviewsLikes || review.SeasonsReviewsLikes || review.EpisodesReviewsLikes || review.MoviesReviewsLikes;
  const likesCount =
    review._count.SeriesReviewsLikes ||
    review._count.SeasonsReviewsLikes ||
    review._count.EpisodesReviewsLikes ||
    review._count.MoviesReviewsLikes;

  return (
    <div
      key={review.id}
      className={`${
        linkedReview && "animate-pulse-bg-once animate-pulse-bg from-primaryBackground to-[#1A1A1A]"
      } p-4 rounded-md group`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Link href={`/profile/${review.user.profile.username}`} className="flex items-center gap-2">
          <ImageWithFallback
            src={review.user.image}
            fallbackSrc="/placeholder_profile.png"
            width={32}
            height={32}
            alt="Profile picture"
            className="rounded-full"
          />
          <p className="text-xl">{review.user.profile.username}</p>
        </Link>

        <div className="flex gap-2 ml-auto opacity-25 group-hover:opacity-80">
          <button
            className={`flex items-center gap-1 transition-all duration-300 ease-in-out hover:text-blue-700`}
            onClick={async () => {
              try {
                await navigator.share({
                  title: "Track the best movies and shows using Tracktr",
                  text: "See my review on Tracktr!",
                  url: `${link}/reviews?review=${review.id}`,
                });
              } catch (err) {
                console.error("Failed to share ", err);
              }
            }}
          >
            <MdShare className="text-xl" />
          </button>
          {session.status === "authenticated" ? (
            <>
              {session?.data?.user?.id === review.user_id ? (
                <>
                  <button
                    className="text-3xl transition-all duration-300 ease-in-out hover:text-green-700"
                    onClick={() => handleEdit(review)}
                  >
                    <MdEdit className="text-xl" />
                  </button>
                  <button
                    className="text-3xl transition-all duration-300 ease-in-out hover:text-red-700"
                    onClick={() => handleDelete(review)}
                  >
                    <MdDelete className="text-xl" />
                  </button>
                  <div className={`flex items-center gap-1 transition-all duration-300 ease-in-out`}>
                    <AiOutlineLike className="text-xl" />
                    <span className="text-xs">{likesCount}</span>
                  </div>
                </>
              ) : (
                <button
                  className={`flex items-center gap-1 transition-all duration-300 ease-in-out ${
                    userLikes?.length < 1 ? "hover:text-green-700" : "hover:text-red-700"
                  }`}
                  onClick={() => {
                    if (userLikes?.length > 0) handleDeleteLike(review);
                    else handleLike(review);
                  }}
                >
                  {userLikes?.length > 0 ? (
                    <>
                      <AiTwotoneLike className="text-xl" />
                      <span className="text-xs">{likesCount}</span>
                    </>
                  ) : (
                    <>
                      <AiOutlineLike className="text-xl" />
                      <span className="text-xs">{likesCount}</span>
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className={`flex items-center gap-1 transition-all duration-300 ease-in-out`}>
              <AiOutlineLike className="text-xl" />
              <span className="text-xs">{likesCount}</span>
            </div>
          )}
        </div>
      </div>
      <div className="whitespace-pre-wrap">{review.content}</div>

      <div className="mt-2 text-xs italic">
        Created{" "}
        {review.created.toLocaleString("en-UK", {
          dateStyle: review.updated ? "short" : "long",
          timeStyle: "short",
        })}
        {review.updated && (
          <>
            , updated{" "}
            {review.updated.toLocaleString("en-UK", {
              dateStyle: "short",
            })}
          </>
        )}
      </div>
    </div>
  );
};

interface IReviewsBlock {
  reviewPage?: boolean;
  linkedReview?: any;
  refetchReviews: () => void;
  isRefetching: boolean;
  themeColor: IThemeColor;
  reviews: any[];
  // Typescript is complicated okay
  // | (MoviesReviews & { user: User & { profile: Profile } })[]
  // | (SeriesReviews & { user: User & { profile: Profile } })[]
  // | (SeasonsReviews & { user: User & { profile: Profile } })[]
  // | (EpisodesReviews & { user: User & { profile: Profile } })[];
}

export default ReviewsBlock;
