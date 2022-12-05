import { ChangeEvent, useState } from "react";
import { MdReviews } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import Modal from "../modal/Modal";
import { IThemeColor } from "../watchButton/BaseWatchButton";

const ReviewButton = ({ themeColor }: { themeColor: IThemeColor }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;
    setSearchInput(value);
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
          <MdReviews className="text-2xl" />
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
                className="block w-full p-2 mt-1 bg-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={searchInput}
                onChange={handleInput}
              />
              <p className="mt-2 text-sm text-gray-500">Max 512 characters</p>
              <button
                style={{
                  backgroundColor: themeColor.hex,
                }}
                className={`flex items-center justify-between px-3 py-2 mt-3 rounded-md ${
                  themeColor.isDark && "text-white"
                } ${themeColor.isLight && "text-primaryBackground"}`}
              >
                <div>Submit</div>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ReviewButton;
