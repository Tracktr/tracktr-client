import Link from "next/link";
import { BackdropImage } from "../../utils/generateImages";

interface RecommendationsProps {
  recommendations: any;
  type: "movies" | "tv";
}

const RecommendationsBlock = ({ recommendations, type }: RecommendationsProps) => {
  console.log(recommendations);

  return (
    recommendations.results.length > 6 && (
      <div className="mt-32">
        <p className="px-4 pb-1 text-3xl italic font-normal opacity-20">Recommended {type}</p>
        <div className="grid w-full grid-cols-6">
          {recommendations.results.slice(0, 6).map((recommendation: any) => {
            const image = BackdropImage({
              path: recommendation.backdrop_path,
              size: "lg",
            });

            return (
              <Link href={`/${type}/${recommendation.id}`} key={recommendation.id}>
                <a>
                  <div
                    key={recommendation.id}
                    className="relative w-full h-52"
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundPosition: "center center",
                      backgroundSize: "cover",
                    }}
                  >
                    <p>{recommendation.title}</p>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    )
  );
};

export default RecommendationsBlock;
