import Poster, { IPoster } from "./Poster";

interface IRecommendations {
  recommendations: IPoster[];
}

const Recommendations = ({ recommendations }: IRecommendations) => (
  <div>
    <div className="font-bold my-3">Our Recommendations</div>
    <div className="flex gap-6">
      {recommendations.map((r) => (
        <Poster imageSrc={r.imageSrc} name={r.name} />
      ))}
    </div>
  </div>
);

export default Recommendations;
