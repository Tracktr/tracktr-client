import { ImCross } from "react-icons/im";

const ModalTitle = ({ title, onExit }: { title: string; onExit: () => void }) => {
  return (
    <div className="sticky top-0 bg-primaryBackground">
      <div className="flex items-center py-4">
        <div className="text-2xl">{title}</div>
        <button className="ml-auto" onClick={onExit}>
          <ImCross />
        </button>
      </div>
    </div>
  );
};

export default ModalTitle;
