/* eslint-disable react/jsx-no-useless-fragment */
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingPosters from "../posters/LoadingPoster";

interface ILoadingPageComponents {
  status: "loading" | "error" | "success" | "idle";
  children: any;
  posters?: boolean;
}

const LoadingPageComponents = ({ status, children, posters }: ILoadingPageComponents) =>
  useMemo(() => {
    // TODO: Error component
    if (status === "error") {
      return <p className="pt-64">Error</p>;
    }

    if (status === "loading") {
      if (posters) {
        return <LoadingPosters />;
      }

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
  }, [status, children, posters]);

export default LoadingPageComponents;
