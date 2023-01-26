import ReactDOM from "react-dom";
import { motion } from "framer-motion";

const Backdrop = ({ children, onClick }: { children: JSX.Element | JSX.Element[]; onClick: () => void }) => {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-opacity-75 bg-primaryBackground"
    >
      {children}
    </motion.div>
  );
};

const ModalWrapper = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full h-auto max-w-xl px-4 text-white rounded-md shadow-xl bg-primaryBackground"
    >
      {children}
    </div>
  );
};

const Modal = ({ handleClose, children }: { handleClose: () => void; children: JSX.Element | JSX.Element[] }) => {
  document.body.style.overflow = "hidden";

  return ReactDOM.createPortal(
    <Backdrop
      onClick={() => {
        document.body.style.overflow = "auto";
        handleClose();
      }}
    >
      <ModalWrapper>{children}</ModalWrapper>
    </Backdrop>,
    document.body
  );
};

export default Modal;
