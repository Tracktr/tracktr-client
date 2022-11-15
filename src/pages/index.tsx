import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingPageComponents from "../components/common/LoadingPageComponents";
import SearchHeader from "../components/search/SearchHeader";

const Home: NextPage = () => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.push("/dashboard");
    }
  });

  return (
    <LoadingPageComponents status={sessionStatus === "loading" ? "loading" : "success"}>
      {() => (
        <SearchHeader
          title="things to watch"
          type="multi"
          backgroundImage="https://www.themoviedb.org/t/p/original/xMMrBziwJqrgjerqpNeQvwuwiUp.jpg"
        />
      )}
    </LoadingPageComponents>
  );
};

export default Home;
