import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import Review from "../common/Review";
import capitalizeFirstLetter from "../../utils/capitalize";

export type ReviewType = "movie" | "series" | "season" | "episodes";

export interface IReview {
  type: ReviewType;
  id: string;
  title: string;
  content: string;
  created: Date;
  user: {
    image: string;
    username: string;
  };
  item: {
    id: number;
    title: string;
    poster: string;
  };
}

export interface IApproveReview {
  reviews: IReview[];
  approveItem: (type: ReviewType, reviewID: string) => void;
  removeItem: (type: ReviewType, reviewID: string) => void;
  isLoading: boolean;
}

const ApproveReview = ({ reviews, approveItem, removeItem, isLoading }: IApproveReview) => {
  const [currentLoadingID, setCurrentLoadingID] = useState<string>();

  return (
    <div className="md:w-[50%] bg-[#1A1A1A] p-4 rounded">
      <div className="mb-2 text-xl font-bold">Reviews</div>
      {reviews && reviews.length > 0 ? (
        <div className={`flex flex-col gap-6 ${isLoading && "opacity-50"}`}>
          {reviews.map((review: IReview) => {
            return (
              <div key={review.id} className="bg-[#343434] hover:bg-opacity-90 py-5 px-4 rounded">
                <div className="mb-1 font-bold">{capitalizeFirstLetter(review.type)} review</div>
                <Review
                  id={review.id}
                  content={review.content}
                  created={review.created}
                  friend={{
                    image: review.user.image,
                    name: review.user.username,
                  }}
                  item={review.item}
                />
                <button
                  className="w-full p-2 mb-2 mr-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:outline-none hover:bg-blue-700 focus:ring-blue-800 disabled:cursor-not-allowed disabled:bg-gray-700"
                  onClick={() => {
                    setCurrentLoadingID(review.id);
                    approveItem(review.type, review.id);
                  }}
                  disabled={isLoading && currentLoadingID === review.id}
                >
                  {isLoading && currentLoadingID === review.id ? (
                    <div className="flex items-center justify-center h-5 gap-2">
                      <ImSpinner2 className="animate-spin" />
                    </div>
                  ) : (
                    <div>Approve</div>
                  )}
                </button>
                <button
                  className="w-full p-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg focus:ring-4 focus:outline-none hover:bg-red-700 focus:red-blue-800 disabled:cursor-not-allowed disabled:bg-gray-700"
                  onClick={() => {
                    setCurrentLoadingID(review.id);
                    removeItem(review.type, review.id);
                  }}
                  disabled={isLoading && currentLoadingID === review.id}
                >
                  {isLoading && currentLoadingID === review.id ? (
                    <div className="flex items-center justify-center h-5 gap-2">
                      <ImSpinner2 className="animate-spin" />
                    </div>
                  ) : (
                    <div>Remove</div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div>No (unapproved) reviews</div>
      )}
    </div>
  );
};

export default ApproveReview;
