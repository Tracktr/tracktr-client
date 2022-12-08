import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { IoIosAdd, IoMdInformation } from "react-icons/io";
import { MdOutlineReviews } from "react-icons/md";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";
import { trpc } from "../../utils/trpc";
import Modal from "../modal/Modal";
import { IThemeColor } from "../watchButton/BaseWatchButton";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [input, setInput] = useState("");

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
    setInput(value);
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
                id="about"
                name="about"
                rows={3}
                className="block w-full p-2 mt-1 bg-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed"
                value={input}
                onChange={handleInput}
                disabled={addSeriesReview.isLoading || addMovieReview.isLoading}
              />
              <p className="mt-2 text-sm text-gray-500">Max 512 characters</p>
              <button
                onClick={onSubmit}
                style={{
                  backgroundColor: themeColor.hex,
                }}
                className={`flex items-center justify-between px-3 py-2 mt-3 rounded-md ${
                  themeColor.isDark && "text-white"
                } ${themeColor.isLight && "text-primaryBackground"}`}
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
