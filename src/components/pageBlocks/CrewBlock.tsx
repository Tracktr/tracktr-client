import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import HorizontalScrollContainer from "../common/HorizontalScrollContainer";
import Modal from "../modal/Modal";
import ModalTitle from "../modal/ModalTitle";
import PersonPoster from "../posters/PersonPoster";

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
  const [modalOpen, setModalOpen] = useState(false);

  if (crew.length > 0) {
    return (
      <>
        <div className="relative mx-1 md:mx-0 md:mb-24">
          <div className="flex items-center justify-between gap-4 pb-4 text-4xl font-bold">
            <h2>Crew</h2>
            <button
              onClick={() => setModalOpen(!modalOpen)}
              className="items-center px-3 py-1 text-xs text-center rounded-full cursor-pointer bg-primary text-primaryBackground"
            >
              Show all crew
            </button>
          </div>
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

        <AnimatePresence initial={false} mode="wait">
          {modalOpen && (
            <Modal handleClose={() => setModalOpen(!modalOpen)}>
              <div className="px-4 pb-4">
                <ModalTitle title="Cast" onExit={() => setModalOpen(!modalOpen)} />
                <div className="grid justify-start grid-cols-2 gap-4 px-4 sm:grid-cols-3">
                  {crew.map((item, i) => (
                    <div key={"cast" + item.id + i} className="flex-shrink-0">
                      <PersonPoster
                        imageSrc={item.profile_path}
                        name={item.original_name}
                        url={`/person/${item.id}`}
                        job={item?.job}
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

export default CrewBlock;
