import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosAdd, IoMdInformation } from "react-icons/io";
import { MdOutlineReviews } from "react-icons/md";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import { trpc } from "../../../utils/trpc";
import Modal from "../../modal/Modal";
import { IThemeColor } from "../../watchButton/BaseWatchButton";

const ReviewButton = ({
  themeColor,
  movieID,
  seriesID,
  seasonID,
  episodeID,
  refetchReviews,
}: {
  themeColor: IThemeColor;
  movieID?: number | undefined;
  seriesID?: number | undefined;
  seasonID?: number | undefined;
  episodeID?: number | undefined;
  refetchReviews: () => void;
}) => {
  const router = useRouter();
  const MAX_MESSAGE_SIZE = 512;
  const [modalOpen, setModalOpen] = useState(false);
  const [input, setInput] = useState("");
  const [inputSize, setInputSize] = useState(0);
  const [inputError, setInputError] = useState("");

  const addMovieReview = trpc.review.addMovieReview.useMutation({
    onSuccess: () => {
      toast("Review Added", {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      setModalOpen(!modalOpen);
      refetchReviews();
      router.push("#reviews");
    },
    onError: () => {
      toast("Failed to add review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });
  const addSeriesReview = trpc.review.addSeriesReview.useMutation({
    onSuccess: () => {
      toast("Review Added", {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      setModalOpen(!modalOpen);
      refetchReviews();
      router.push("#reviews");
    },
    onError: () => {
      toast("Failed to add review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });
  const addSeasonReview = trpc.review.addSeasonReview.useMutation({
    onSuccess: () => {
      toast("Review Added", {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      setModalOpen(!modalOpen);
      refetchReviews();
      router.push("#reviews");
    },
    onError: () => {
      toast("Failed to add review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });
  const addEpisodesReview = trpc.review.addEpisodeReview.useMutation({
    onSuccess: () => {
      toast("Review Added", {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      setModalOpen(!modalOpen);
      refetchReviews();
      router.push("#reviews");
    },
    onError: () => {
      toast("Failed to add review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

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
    if (episodeID !== undefined) {
      addEpisodesReview.mutate({
        episodeID,
        content: input,
      });
    } else if (seasonID !== undefined) {
      addSeasonReview.mutate({
        seasonID,
        content: input,
      });
    } else if (seriesID !== undefined) {
      addSeriesReview.mutate({
        seriesID,
        content: input,
      });
    } else if (movieID !== undefined) {
      addMovieReview.mutate({
        movieID,
        content: input,
      });
    }
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(!modalOpen)}
        style={{
          backgroundColor: themeColor.hex,
        }}
        className={`
        flex items-center justify-between mt-2 rounded-md          
        ${themeColor.isDark && "text-white"}
        ${themeColor.isLight && "text-primaryBackground"}
      `}
        aria-label="Create a review"
      >
        <span className="px-3 py-2" data-tip="Create a review">
          <ReactTooltip />
          <MdOutlineReviews className="text-2xl" />
        </span>
      </button>

      {modalOpen && (
        <Modal handleClose={() => setModalOpen(!modalOpen)}>
          <div className="py-4">
            <div className="text-2xl">Write a review</div>
            <div className="mt-2">
              <textarea
                id="review"
                rows={4}
                className={`block p-2.5 w-full text-sm rounded-lg border disabled:cursor-not-allowed ${
                  inputError
                    ? "text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 bg-red-100 border-red-400"
                    : "text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 border-gray-600"
                }`}
                placeholder="Leave a comment..."
                onChange={handleInput}
                disabled={addSeasonReview.isLoading || addMovieReview.isLoading}
                aria-describedby="review-helper"
              ></textarea>
              <p id="review-helper" className={`mt-2 mb-6 text-sm ${inputError ? "text-red-400" : "text-gray-400"}`}>
                {inputSize}/{MAX_MESSAGE_SIZE} characters used.
              </p>

              <button
                onClick={onSubmit}
                disabled={addSeriesReview.isLoading || addMovieReview.isLoading || Boolean(inputError)}
                style={{
                  backgroundColor: themeColor.hex,
                }}
                className={`flex items-center justify-between px-3 py-2 mt-3 rounded-md ${
                  themeColor.isDark && "text-white"
                } ${themeColor.isLight && "text-primaryBackground"} disabled:cursor-not-allowed`}
                aria-label="Submit review"
              >
                {addSeriesReview.isLoading || addMovieReview.isLoading ? (
                  <div className="flex items-center gap-3">
                    <ImSpinner2 className="animate-spin" />
                    <div>Loading</div>
                  </div>
                ) : (
                  <div>Submit</div>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ReviewButton;
