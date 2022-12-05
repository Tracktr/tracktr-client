import ImageWithFallback from "../common/ImageWithFallback";

const ReviewsBlock = ({ reviews }: IReviewsBlock) => {
  console.log(reviews);

  return (
    <div className="relative mx-1 md:mx-0 md:mb-8">
      <h2 className="pb-4 text-4xl font-bold">Reviews</h2>
      <div className="flex flex-col gap-6">
        {reviews.map((review) => (
          <div key={review.id}>
            <div className="flex items-center gap-2 mb-2">
              <ImageWithFallback
                src={review.user.image}
                fallbackSrc="/placeholder_profile.png"
                width="32"
                height="32"
                alt="Profile picture"
                className="rounded-full"
              />
              <p className="text-xl">{review.user.profile.username}</p>
              <div className="ml-auto text-sm">
                {review.created.toLocaleString("en-UK", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
            </div>
            <div>{review.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface IReviewsBlock {
  reviews: {
    id: string;
    content: string;
    user_id: string;
    series_id?: number;
    moviesId?: any;
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified?: any;
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
