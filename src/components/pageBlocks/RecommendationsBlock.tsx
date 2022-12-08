import Link from "next/link";
import { BackdropImage } from "../../utils/generateImages";

interface RecommendationsProps {
  recommendations: any;
  type: "movies" | "tv";
}

const RecommendationsBlock = ({ recommendations, type }: RecommendationsProps) => {
  return recommendations.results.length > 6 ? (
    <div className="hidden mt-32 lg:block">
      <p className="px-4 pb-1 text-3xl italic font-normal opacity-20">Recommended {type}</p>
      <div className="grid w-full grid-cols-6">
        {recommendations.results
          .filter((element: { backdrop_path: null }) => element.backdrop_path !== null)
          .slice(0, 6)
          .map((recommendation: any) => {
            const image = BackdropImage({
              path: recommendation.backdrop_path,
              size: "lg",
            });

            return (
              <Link href={`/${type}/${recommendation.id}`} key={recommendation.id}>
                <a
                  className="relative flex items-end w-full h-52 group"
                  style={{
                    background: `linear-gradient(180deg, rgba(26,26,26,0) 0%, rgba(26,26,26,1) 100%), url(${image})`,
                    backgroundPosition: "center center",
                    backgroundSize: "cover",
                  }}
                >
                  <p className="pb-4 mx-4 truncate transition-all duration-300 ease-in-out overflow-ellipsis group-hover:pb-8">
                    {recommendation.title || recommendation.name}
                  </p>
                </a>
              </Link>
            );
          })}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default RecommendationsBlock;
