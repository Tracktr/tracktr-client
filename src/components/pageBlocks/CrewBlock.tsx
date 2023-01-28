import PersonPoster from "../posters/PersonPoster";
import dynamic from "next/dynamic";

const HorizontalScrollContainer = dynamic(() => import("../common/HorizontalScrollContainer"), { ssr: false });

interface ICrew {
  crew: {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    character: string;
    credit_id: string;
    order: number;
    job: string;
  }[];
}

const CrewBlock = ({ crew }: ICrew) => {
  if (crew.length > 0) {
    return (
      <div className="relative mx-1 md:mx-0 md:mb-24">
        <h2 className="pb-4 text-4xl font-bold">Crew</h2>
        <div>
          <HorizontalScrollContainer>
            {crew.slice(0, 12).map((item, i) => (
              <div key={"crew" + item.id + i} className="flex-shrink-0">
                <PersonPoster
                  imageSrc={item.profile_path}
                  name={item.original_name}
                  job={item.job}
                  url={`/person/${item.id}`}
                />
              </div>
            ))}
          </HorizontalScrollContainer>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default CrewBlock;
