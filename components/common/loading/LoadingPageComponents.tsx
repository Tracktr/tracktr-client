/* eslint-disable react/jsx-no-useless-fragment */
import { useMemo } from "react";

interface ILoadingPageComponents {
  status: "loading" | "error" | "success" | "idle";
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
      return <></>;
    }

    if (status === "success") {
      if (typeof children === "function") {
        return children();
      }
    }

    return <></>;
  }, [status, children]);

export default LoadingPageComponents;
