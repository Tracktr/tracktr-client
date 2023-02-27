import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { useCallback, useEffect } from "react";

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
      onKeyDown={(e) => e.stopPropagation}
      role="none"
      className="w-full h-auto max-w-xl max-h-[80%] overflow-auto text-white rounded-md shadow-xl bg-primaryBackground"
    >
      {children}
    </div>
  );
};

const Modal = ({ handleClose, children }: { handleClose: () => void; children: JSX.Element | JSX.Element[] }) => {
  const escFunction = useCallback(
    (event: any) => {
      if (event.key === "Escape") {
        handleClose();
      }
    },
    [handleClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  return ReactDOM.createPortal(
    <Backdrop
      onClick={() => {
        handleClose();
      }}
    >
      <ModalWrapper>{children}</ModalWrapper>
    </Backdrop>,
    document.body
  );
};

export default Modal;
