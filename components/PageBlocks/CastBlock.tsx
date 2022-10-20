import HorizontalScrollContainer from "../common/HorizontalScrollContainer";
import PersonPoster from "../common/poster/PersonPoster";

interface ICast {
  cast: any;
}

const CastBlock = ({ cast }: ICast) => (
  <div className="relative mb-24">
    <h2 className="pb-4 text-4xl font-bold">Cast</h2>
    <div>
      <HorizontalScrollContainer>
        {cast.slice(0, 12).map((item: any) => (
          <div className="flex-shrink-0" key={item.id}>
            <PersonPoster
              key={item.id}
              imageSrc={item.profile_path}
              name={item.original_name}
              url={`/person/${item.id}`}
            />
          </div>
        ))}
      </HorizontalScrollContainer>
    </div>
  </div>
);

export default CastBlock;
