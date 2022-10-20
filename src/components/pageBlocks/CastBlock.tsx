import HorizontalScrollContainer from "../common/HorizontalScrollContainer";
import PersonPoster from "../posters/PersonPoster";

interface ICast {
  cast: any;
}

const CastBlock = ({ cast }: ICast) => (
  <div className="relative md:mb-24">
    <h2 className="pb-4 text-4xl font-bold">Cast</h2>
    <div>
      <HorizontalScrollContainer>
        {cast.slice(0, 12).map((item: any) => (
          <div key={item.id} className="flex-shrink-0">
            <PersonPoster imageSrc={item.profile_path} name={item.original_name} url={`/person/${item.id}`} />
          </div>
        ))}
      </HorizontalScrollContainer>
    </div>
  </div>
);

export default CastBlock;
