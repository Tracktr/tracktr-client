import Link from "next/link";
import { BackdropImage } from "../../utils/generateImages";

interface RecommendationsProps {
  recommendations: any;
  type: "movies" | "tv";
}

const RecommendationsBlock = ({ recommendations, type }: RecommendationsProps) => {
  console.log(recommendations);

  return (
    <div className="grid w-full grid-cols-6 mt-32">
      {recommendations.results.length > 0 &&
        recommendations.results.slice(0, 6).map((recommendation: any) => {
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
  );
};

export default RecommendationsBlock;
