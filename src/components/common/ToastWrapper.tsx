import { ToastContainer } from "react-toastify";

const ToastWrapper = () => {
  return (
    <ToastContainer
      toastClassName={"relative p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"}
      bodyClassName={() => "text-md font-medium p-3 text-black flex items-center"}
      position="bottom-right"
      autoClose={1500}
      icon={false}
      hideProgressBar
    />
  );
};

export default ToastWrapper;
