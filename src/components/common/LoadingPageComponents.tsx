/* eslint-disable react/jsx-no-useless-fragment */
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingPosters from "../posters/LoadingPoster";
import NProgress from "nprogress";

interface ILoadingPageComponents {
  status: "loading" | "error" | "success" | "idle";
  children: () => any;
  posters?: boolean;
}

const LoadingPageComponents = ({ status, children, posters }: ILoadingPageComponents) =>
  useMemo(() => {
    typeof window !== "undefined" && NProgress.configure({ showSpinner: false });

    // TODO: Error component
    if (status === "error") {
      typeof window !== "undefined" && NProgress.done();
      return <p className="max-w-6xl px-4 py-24 m-auto">Error</p>;
    }

    if (status === "loading") {
      typeof window !== "undefined" && NProgress.start();
      if (posters) {
        return <LoadingPosters />;
      }

      return <div className="h-screen" />;
    }

    if (status === "success") {
      typeof window !== "undefined" && NProgress.done();
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

    return <></>;
  }, [status, children, posters]);

export default LoadingPageComponents;
