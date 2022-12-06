import { useSession } from "next-auth/react";
import Link from "next/link";
import { MdDelete } from "react-icons/md";
import { trpc } from "../../utils/trpc";
import ImageWithFallback from "../common/ImageWithFallback";

const ReviewsBlock = ({ reviews, refetchReviews, isRefetching }: IReviewsBlock) => {
  const session = useSession();

  const removeMovieReview = trpc.review.removeMovieReview.useMutation({
    onSuccess: () => refetchReviews(),
  });
  const removeSeriesReview = trpc.review.removeSeriesReview.useMutation({
    onSuccess: () => refetchReviews(),
  });
  const removeSeasonReview = trpc.review.removeSeasonReview.useMutation({
    onSuccess: () => refetchReviews(),
  });
  const removeEpisodeReview = trpc.review.removeEpisodeReview.useMutation({
    onSuccess: () => refetchReviews(),
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

  return (
    <div className="relative mx-1 md:mx-0 md:mb-8" id="reviews">
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
                {session?.data?.user?.id === review.user_id && (
                  <button
                    className="ml-auto text-3xl transition-all duration-300 ease-in-out hover:text-red-700"
                    onClick={() => handleDelete(review)}
                  >
                    <MdDelete className="text-xl" />
                  </button>
                )}
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
  isRefetching: boolean;
  reviews: {
    id: string;
    content: string;
    user_id: string;
    series_id?: number;
    moviesId?: number;
    season_id?: number;
    episode_id?: number;
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
