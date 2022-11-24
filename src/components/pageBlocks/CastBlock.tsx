import HorizontalScrollContainer from "../common/HorizontalScrollContainer";
import PersonPoster from "../posters/PersonPoster";

interface ICast {
  cast: {
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
  }[];
}

const CastBlock = ({ cast }: ICast) => {
  if (cast.length > 0) {
    return (
      <div className="relative mx-1 md:mx-0 md:mb-24">
        <h2 className="pb-4 text-4xl font-bold">Cast</h2>
        <div>
          <HorizontalScrollContainer>
            {cast.slice(0, 12).map((item) => (
              <div key={item.id} className="flex-shrink-0">
                <PersonPoster imageSrc={item.profile_path} name={item.original_name} url={`/person/${item.id}`} />
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

export default CastBlock;
