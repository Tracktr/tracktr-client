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
      <div className="h-[50vh] md:flex items-center max-w-6xl md:mx-auto pt-16 pb-6 mx-6">
        <div className="text-5xl font-bold">
          Find amazing {type}
          <span className="text-primary">.</span>
        </div>
        <div className="ml-auto">
          <div className="my-3 font-bold">Our Recommendations</div>
          <div className="flex gap-6">
            {recommendations.map((r) => (
              <BackgroundPoster key={r.name} imageSrc={r.imageSrc} name={r.name} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PosterHeader;
