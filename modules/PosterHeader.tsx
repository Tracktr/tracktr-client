import LargeSort from "../components/LargeSort";
import { BackgroundPoster, IPoster } from "../components/Poster";

interface IPosterHeader {
  backgroundImage: string;
  type: string;
  recommendations: IPoster[];
}

const PosterHeader = ({ backgroundImage, type, recommendations }: IPosterHeader) => (
  <div>
    <div
      className="h-[50vh] blur-sm"
      style={{
        background: `linear-gradient(0deg, #101010 3.79%, rgba(16, 16, 16, 0) 100%), url(${backgroundImage}) no-repeat center`,
      }}
    />
    <div className="absolute top-0 w-screen max-w-full">
      <div className="h-[50vh] flex items-center max-w-6xl mx-auto">
        <LargeSort type={type} />
        <div className="ml-auto">
          <div className="font-bold my-3">Our Recommendations</div>
          <div className="flex gap-6">
            {recommendations.map((r) => (
              <BackgroundPoster imageSrc={r.imageSrc} name={r.name} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PosterHeader;
