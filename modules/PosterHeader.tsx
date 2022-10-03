import LargeSort from "../components/LargeSort";
import { IPoster } from "../components/Poster";
import Recommendations from "../components/Recommendations";

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
          <Recommendations recommendations={recommendations} />
        </div>
      </div>
    </div>
  </div>
);

export default PosterHeader;
