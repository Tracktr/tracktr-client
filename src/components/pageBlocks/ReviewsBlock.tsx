import Link from "next/link";
import { MdDelete } from "react-icons/md";
import { trpc } from "../../utils/trpc";
import ImageWithFallback from "../common/ImageWithFallback";

const ReviewsBlock = ({ reviews, refetchReviews }: IReviewsBlock) => {
  const removeMovieReview = trpc.review.removeMovieReview.useMutation({
    onSuccess: () => refetchReviews(),
  });
  const removeSeriesReview = trpc.review.removeSeriesReview.useMutation({
    onSuccess: () => refetchReviews(),
  });

  const handleDelete = (e: any) => {
    if (e.series_id) {
      removeSeriesReview.mutate({ seriesID: e.series_id });
    } else if (e.movie_id) {
      removeMovieReview.mutate({ movieID: e.movie_id });
    }
  };

  return (
    <div className="relative mx-1 md:mx-0 md:mb-8" id="reviews">
      <h2 className="pb-4 text-4xl font-bold">Reviews</h2>
      <div className="flex flex-col gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id}>
              <div className="flex items-center gap-2 mb-2">
                <Link href={`/profile/${review.user.profile.username}`}>
                  <a className="flex items-center gap-2">
                    <ImageWithFallback
                      src={review.user.image}
                      fallbackSrc="/placeholder_profile.png"
                      width="32"
                      height="32"
                      alt="Profile picture"
                      className="rounded-full"
                    />
                    <p className="text-xl">{review.user.profile.username}</p>
                  </a>
                </Link>
                <button
                  className="ml-auto text-3xl transition-all duration-300 ease-in-out hover:text-red-700"
                  onClick={() => handleDelete(review)}
                >
                  <MdDelete className="text-xl" />
                </button>
                <div className="text-sm">
                  {review.created.toLocaleString("en-UK", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </div>
              <div>{review.content}</div>
            </div>
          ))
        ) : (
          <div>No reviews found</div>
        )}
      </div>
    </div>
  );
};

interface IReviewsBlock {
  refetchReviews: () => void;
  reviews: {
    id: string;
    content: string;
    user_id: string;
    series_id?: number;
    moviesId?: number;
    created: Date;
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified?: boolean;
      image: string;
      profile: {
        username: string;
        adult: boolean;
        language: string;
        region: string;
        userId: string;
      };
    };
  }[];
}

export default ReviewsBlock;
