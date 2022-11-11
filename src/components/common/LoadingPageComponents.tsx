/* eslint-disable react/jsx-no-useless-fragment */
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ILoadingPageComponents {
  status: "loading" | "error" | "success" | "idle";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}

const LoadingPageComponents = ({ status, children }: ILoadingPageComponents) =>
  useMemo(() => {
    // TODO: Error component
    if (status === "error") {
      return <p className="pt-64">Error</p>;
    }

    // TODO: Do something with the loading status
    if (status === "loading") {
      return <div className="h-screen" />;
    }

    if (status === "success") {
      if (typeof children === "function") {
        return (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ease: "anticipate", duration: 0.75 }}
            >
              {children()}
            </motion.div>
          </AnimatePresence>
        );
      }
    }

    return <></>;
  }, [status, children]);

export default LoadingPageComponents;
