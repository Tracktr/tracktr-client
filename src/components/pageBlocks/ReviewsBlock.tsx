import { useSession } from "next-auth/react";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosAdd, IoIosRemove, IoMdInformation } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { trpc } from "../../utils/trpc";
import ImageWithFallback from "../common/ImageWithFallback";
import Modal from "../modal/Modal";
import ModalTitle from "../modal/ModalTitle";
import { IThemeColor } from "../watchButton/BaseWatchButton";

const ReviewsBlock = ({ reviews, refetchReviews, isRefetching, themeColor }: IReviewsBlock) => {
  const session = useSession();
  const MAX_MESSAGE_SIZE = 512;
  const [currentID, setCurrentID] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [input, setInput] = useState("");
  const [inputSize, setInputSize] = useState(0);
  const [inputError, setInputError] = useState("");

  const removeMovieReview = trpc.review.removeMovieReview.useMutation({
    onSuccess: () => {
      toast("Review Removed", {
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
  const removeSeriesReview = trpc.review.removeSeriesReview.useMutation({
    onSuccess: () => {
      toast("Review Removed", {
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
  const removeSeasonReview = trpc.review.removeSeasonReview.useMutation({
    onSuccess: () => {
      toast("Review Removed", {
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
  const removeEpisodeReview = trpc.review.removeEpisodeReview.useMutation({
    onSuccess: () => {
      toast("Review Removed", {
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

  const editMovieReview = trpc.review.updateMovieReview.useMutation({
    onSuccess: () => {
      toast("Review updated", {
        icon: <IoIosAdd className="text-3xl text-red-500" />,
      });
      refetchReviews();
      setModalOpen(false);
    },
    onError: () => {
      toast("Failed to remove review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });
  const editSeriesReview = trpc.review.updateSeriesReview.useMutation({
    onSuccess: () => {
      toast("Review updated", {
        icon: <IoIosAdd className="text-3xl text-red-500" />,
      });
      refetchReviews();
      setModalOpen(false);
    },
    onError: () => {
      toast("Failed to remove review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });
  const editSeasonReview = trpc.review.updateSeasonsReview.useMutation({
    onSuccess: () => {
      toast("Review updated", {
        icon: <IoIosAdd className="text-3xl text-red-500" />,
      });
      refetchReviews();
      setModalOpen(false);
    },
    onError: () => {
      toast("Failed to remove review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });
  const editEpisodeReview = trpc.review.updateEpisodeReview.useMutation({
    onSuccess: () => {
      toast("Review updated", {
        icon: <IoIosAdd className="text-3xl text-red-500" />,
      });
      refetchReviews();
      setModalOpen(false);
    },
    onError: () => {
      toast("Failed to remove review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const handleDelete = (e: any) => {
    if (e.seasons_id) {
      removeSeasonReview.mutate({ seasonID: e.seasons_id });
    } else if (e.episodes_id) {
      removeEpisodeReview.mutate({ episodeID: e.episodes_id });
    } else if (e.series_id) {
      removeSeriesReview.mutate({ seriesID: e.series_id });
    } else if (e.movie_id) {
      removeMovieReview.mutate({ movieID: e.movie_id });
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
    console.log(typeof reviews[0]);
    if (reviews[0]?.movie_id) {
      editMovieReview.mutate({ movieID: currentID, content: input });
    } else if (reviews[0]?.series_id) {
      editSeriesReview.mutate({ seriesID: currentID, content: input });
    } else if (reviews[0]?.seasons_id) {
      editSeasonReview.mutate({ seasonID: currentID, content: input });
    } else if (reviews[0]?.episodes_id) {
      editEpisodeReview.mutate({ episodeID: currentID, content: input });
    }
  };

  return (
    <div className="relative mx-1 mb-8 md:mx-0" id="reviews">
      <h2 className="pb-4 text-4xl font-bold">Reviews</h2>
      <div className="flex flex-col gap-6">
        {isRefetching ? (
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
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id}>
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
                {session?.data?.user?.id === review.user_id && (
                  <>
                    <button
                      className="ml-auto text-3xl transition-all duration-300 ease-in-out hover:opacity-75"
                      onClick={() => {
                        setCurrentID(review.movie_id || review.seasons_id || review.episodes_id || review.series_id);
                        setModalOpen(!modalOpen);
                        setInput(review.content);
                        setInputSize(review.content.length);
                      }}
                    >
                      <MdEdit className="text-xl" />
                    </button>
                    <button
                      className="text-3xl transition-all duration-300 ease-in-out hover:text-red-700"
                      onClick={() => handleDelete(review)}
                    >
                      <MdDelete className="text-xl" />
                    </button>
                  </>
                )}
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
          ))
        ) : (
          <div>No reviews found</div>
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
                placeholder="Leave a comment..."
                onChange={handleInput}
                disabled={
                  editMovieReview.isLoading ||
                  editSeriesReview.isLoading ||
                  editSeasonReview.isLoading ||
                  editEpisodeReview.isLoading
                }
                aria-describedby="review-helper"
              ></textarea>
              <p id="review-helper" className={`mt-2 mb-6 text-sm ${inputError ? "text-red-400" : "text-gray-400"}`}>
                {inputSize}/{MAX_MESSAGE_SIZE} characters used.
              </p>

              <button
                onClick={onSubmit}
                disabled={
                  editMovieReview.isLoading ||
                  editSeriesReview.isLoading ||
                  editSeasonReview.isLoading ||
                  editEpisodeReview.isLoading ||
                  Boolean(inputError)
                }
                style={{
                  backgroundColor: themeColor.hex,
                }}
                className={`flex items-center justify-between px-3 py-2 mt-3 rounded-md ${
                  themeColor.isDark && "text-white"
                } ${themeColor.isLight && "text-primaryBackground"} disabled:cursor-not-allowed`}
                aria-label="Submit review"
              >
                {editMovieReview.isLoading ||
                editSeriesReview.isLoading ||
                editSeasonReview.isLoading ||
                editEpisodeReview.isLoading ? (
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

interface IReviewsBlock {
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
