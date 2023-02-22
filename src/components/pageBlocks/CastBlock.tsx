import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import HorizontalScrollContainer from "../common/HorizontalScrollContainer";
import Modal from "../modal/Modal";
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
  guestStars: {
    character: string;
    credit_id: string;
    order: number;
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
  }[];
}

const CastBlock = ({ cast, guestStars }: ICast) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (cast.length > 0) {
    return (
      <>
        <div className="relative mx-1 md:mx-0 md:mb-8">
          <div className="flex items-center justify-between gap-4 pb-4 text-4xl font-bold">
            <h2>Cast</h2>
            <button
              onClick={() => setModalOpen(!modalOpen)}
              className="items-center px-3 py-1 text-xs text-center rounded-full cursor-pointer bg-primary text-primaryBackground"
            >
              Show all cast
            </button>
          </div>
          <div>
            <HorizontalScrollContainer>
              {cast.slice(0, 12).map((item, i) => (
                <div key={"cast" + item.id + i} className="flex-shrink-0">
                  <PersonPoster
                    imageSrc={item.profile_path}
                    name={item.original_name}
                    url={`/person/${item.id}`}
                    job={item?.character}
                  />
                </div>
              ))}
            </HorizontalScrollContainer>
          </div>
        </div>

        <AnimatePresence initial={false} mode="wait">
          {modalOpen && (
            <Modal handleClose={() => setModalOpen(!modalOpen)}>
              <div className="py-4">
                <div className="pb-4 text-2xl">Main cast</div>
                <div className="grid justify-start grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:grid-cols-4">
                  {cast.map((item, i) => (
                    <div key={"cast" + item.id + i} className="flex-shrink-0">
                      <PersonPoster
                        imageSrc={item.profile_path}
                        name={item.original_name}
                        url={`/person/${item.id}`}
                        job={item?.character}
                      />
                    </div>
                  ))}
                </div>

                <div className="py-4 text-2xl">Guest stars</div>
                <div className="grid justify-start grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:grid-cols-4">
                  {guestStars.map((item, i) => (
                    <div key={"guestStars" + item.id + i} className="flex-shrink-0">
                      <PersonPoster
                        imageSrc={item.profile_path}
                        name={item.original_name}
                        url={`/person/${item.id}`}
                        job={item?.character}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </>
    );
  } else {
    return <></>;
  }
};

export default CastBlock;
