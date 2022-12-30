/* eslint-disable react/jsx-no-useless-fragment */
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingPosters from "../posters/LoadingPoster";
import NProgress from "nprogress";
import { useRouter } from "next/router";

interface ILoadingPageComponents {
  status: "loading" | "error" | "success" | "idle";
  children: () => any;
  posters?: boolean;
  notFound?: boolean;
}

const LoadingPageComponents = ({ status, children, posters, notFound }: ILoadingPageComponents) => {
  const router = useRouter();

  return useMemo(() => {
    typeof window !== "undefined" && NProgress.configure({ showSpinner: false });

    if (status === "error") {
      typeof window !== "undefined" && NProgress.done();

      if (notFound) router.push("/404");
      else if (posters) return <div>Something went wrong, try reloading the page or going back.</div>;
      else router.push("500");
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
  }, [status, children, posters, router, notFound]);
};

export default LoadingPageComponents;
