import HorizontalScrollContainer from "../common/HorizontalScrollContainer";
import PersonPoster from "../posters/PersonPoster";

interface ICast {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cast: any;
}

const CastBlock = ({ cast }: ICast) => {
  if (cast.length > 0) {
    return (
      <div className="relative mx-1 md:mx-0 md:mb-24">
        <h2 className="pb-4 text-4xl font-bold">Cast</h2>
        <div>
          <HorizontalScrollContainer>
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cast.slice(0, 12).map((item: any) => (
                <div key={item.id} className="flex-shrink-0">
                  <PersonPoster imageSrc={item.profile_path} name={item.original_name} url={`/person/${item.id}`} />
                </div>
              ))
            }
          </HorizontalScrollContainer>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default CastBlock;
