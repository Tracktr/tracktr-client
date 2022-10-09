import { useMemo } from "react";

interface ILoadingPageComponents {
  status: "loading" | "error" | "success" | "idle";
  children: any;
}

const LoadingPageComponents = ({ status, children }: ILoadingPageComponents) =>
  useMemo(() => {
    if (status === "error") {
      return <p className="pt-64">Error</p>;
    }

    if (status === "loading") {
      return <p className="pt-64">Loading...</p>;
    }

    if (status === "success") {
      if (typeof children === "function") {
        return children();
      }
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }, [status, children]);

export default LoadingPageComponents;
