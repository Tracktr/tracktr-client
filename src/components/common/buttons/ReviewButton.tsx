import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosAdd, IoMdInformation } from "react-icons/io";
import { MdOutlineReviews } from "react-icons/md";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { trpc } from "../../../utils/trpc";
import Modal from "../../modal/Modal";
import ModalTitle from "../../modal/ModalTitle";
import { IThemeColor } from "../../watchButton/BaseWatchButton";

const ReviewButton = ({
  themeColor,
  movieID,
  seriesID,
  seasonID,
  episodeID,
  userReview,
  refetchReviews,
}: {
  themeColor: IThemeColor;
  movieID?: number | undefined;
  seriesID?: number | undefined;
  seasonID?: number | undefined;
  episodeID?: number | undefined;
  userReview?: string;
  refetchReviews: () => void;
}) => {
  const router = useRouter();
  const MAX_MESSAGE_SIZE = 512;
  const [modalOpen, setModalOpen] = useState(false);
  const [input, setInput] = useState(userReview || "");
  const [inputSize, setInputSize] = useState(userReview?.length || 0);
  const [inputError, setInputError] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (userReview) setInput(userReview);
  }, [userReview]);

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

  const addReview = trpc.review.addReview.useMutation({
    onSuccess: (data) => {
      toast("Review Added", {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      setInput("");
      setInputSize(0);
      refetchReviews();
      setModalOpen(false);
      router.push(`${link}?review=${data?.id}#reviews`);
    },
    onError: () => {
      toast("Failed to add review", {
        icon: <IoMdInformation className="text-3xl text-blue-500" />,
      });
    },
  });

  const editReview = trpc.review.updateReview.useMutation({
    onSuccess: (data) => {
      toast("Review updated", {
        icon: <IoIosAdd className="text-3xl text-green-500" />,
      });
      setInput("");
      setInputSize(0);
      refetchReviews();
      setModalOpen(false);
      router.push(`${link}?review=${data?.id}#reviews`);
    },
    onError: () => {
      toast("Failed to update review", {
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
      if (userReview) editReview.mutate({ episodeID, content: input });
      else
        addReview.mutate({
          episodeID,
          content: input,
        });
    } else if (seasonID !== undefined) {
      if (userReview) editReview.mutate({ seasonID, content: input });
      else
        addReview.mutate({
          seasonID,
          content: input,
        });
    } else if (seriesID !== undefined) {
      if (userReview) editReview.mutate({ seriesID, content: input });
      else
        addReview.mutate({
          seriesID,
          content: input,
        });
    } else if (movieID !== undefined) {
      if (userReview) editReview.mutate({ movieID, content: input });
      else
        addReview.mutate({
          movieID,
          content: input,
        });
    }
  };

  return (
    <div>
      <button
        onClick={() => setModalOpen(!modalOpen)}
        data-tooltip-id="review"
        data-tooltip-content={userReview ? "Edit your review" : "Create a review"}
        className={`flex items-center justify-between mt-2 rounded-md          
          ${themeColor.isDark && "text-white"}
          ${themeColor.isLight && "text-primaryBackground"}`}
        style={{
          backgroundColor: themeColor.hex,
        }}
        aria-label={userReview ? "Edit your review" : "Create a review"}
      >
        <span className="px-3 py-2">
          <MdOutlineReviews className="text-2xl" />
        </span>
      </button>
      <Tooltip id="review" />

      {modalOpen && (
        <Modal handleClose={() => setModalOpen(!modalOpen)}>
          <div className="px-4 pb-4">
            <ModalTitle title={userReview ? "Edit review" : "Write a review"} onExit={() => setModalOpen(!modalOpen)} />
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
                disabled={addReview.isLoading || editReview.isLoading}
                aria-describedby="review-helper"
              ></textarea>
              <p id="review-helper" className={`mt-2 mb-6 text-sm ${inputError ? "text-red-400" : "text-gray-400"}`}>
                {inputSize}/{MAX_MESSAGE_SIZE} characters used.
              </p>

              <button
                onClick={onSubmit}
                disabled={addReview.isLoading || editReview.isLoading || Boolean(inputError)}
                style={{
                  backgroundColor: themeColor.hex,
                }}
                className={`flex items-center justify-between px-3 py-2 mt-3 rounded-md ${
                  themeColor.isDark && "text-white"
                } ${themeColor.isLight && "text-primaryBackground"} disabled:cursor-not-allowed`}
                aria-label="Submit review"
              >
                {addReview.isLoading || editReview.isLoading ? (
                  <div className="flex items-center gap-3">
                    <ImSpinner2 className="animate-spin" />
                    <div>Loading</div>
                  </div>
                ) : userReview ? (
                  <div>Edit</div>
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
