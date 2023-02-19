import {
  Episodes,
  EpisodesReviews,
  Movies,
  MoviesReviews,
  Seasons,
  SeasonsReviews,
  Series,
  SeriesReviews,
  User,
} from "@prisma/client";
import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import capitalizeFirstLetter from "../../utils/capitalize";
import Review from "../common/Review";

interface IApproveReview {
  reviews:
    | (MoviesReviews & { user: User & { profile: { username: string } | null }; Movies: Movies })[]
    | (SeriesReviews & { user: User & { profile: { username: string } | null }; Series: Series })[]
    | (SeasonsReviews & { user: User & { profile: { username: string } | null }; Seasons: Seasons & Series })[]
    | (EpisodesReviews & {
        user: User & { profile: { username: string } | null };
        Episodes: Episodes & { Seasons: (Seasons & { Series: Series | null }) | null };
      })[]
    | undefined;
  type: "movie" | "series" | "season" | "episodes";
  approveItem: any;
  removeItem: any;
}

const ApproveReview = ({ reviews, type, approveItem, removeItem }: IApproveReview) => {
  const [currentLoadingID, setCurrentLoadingID] = useState<string>();

  return (
    <div className="md:w-[50%] bg-[#1A1A1A] p-4 rounded">
      <div className="text-xl font-bold">{capitalizeFirstLetter(type)} reviews</div>
      {reviews && reviews.length > 0 ? (
        <div className="flex flex-col gap-6">
          {reviews.map((review: any) => {
            return (
              <div key={review.id}>
                <Review
                  content={review.content}
                  created={review.created}
                  friend={{
                    image: review.user.image,
                    name: review.user.profile?.username,
                  }}
                  item={review.Movies || review.Series || review.Episodes?.Seasons?.Series || review.Seasons.Series}
                  hideImage
                />
                <button
                  className="w-full px-2 py-1 mb-2 mr-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg md:mb-0 focus:ring-4 focus:outline-none sm:w-auto hover:bg-blue-700 focus:ring-blue-800 disabled:cursor-not-allowed disabled:bg-gray-700"
                  onClick={() => {
                    setCurrentLoadingID(review.id);
                    approveItem.mutate({
                      reviewID: review.id,
                    });
                  }}
                  disabled={approveItem.isLoading && currentLoadingID === review.id}
                >
                  {approveItem.isLoading && currentLoadingID === review.id ? (
                    <div className="flex items-center gap-2">
                      <ImSpinner2 className="animate-spin" />
                    </div>
                  ) : (
                    <div>Approve</div>
                  )}
                </button>
                <button
                  className="w-full px-2 py-1 text-sm font-medium text-center text-white bg-red-600 rounded-lg focus:ring-4 focus:outline-none sm:w-auto hover:bg-red-700 focus:red-blue-800 disabled:cursor-not-allowed disabled:bg-gray-700"
                  onClick={() => {
                    setCurrentLoadingID(review.id);
                    removeItem.mutate({
                      reviewID: review.id,
                    });
                  }}
                  disabled={removeItem.isLoading && currentLoadingID === review.id}
                >
                  {removeItem.isLoading && currentLoadingID === review.id ? (
                    <div className="flex items-center gap-2">
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
        <div>No (unapproved) {type} reviews</div>
      )}
    </div>
  );
};

export default ApproveReview;
