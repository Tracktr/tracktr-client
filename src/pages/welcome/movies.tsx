import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const WelcomeMoviesPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
    } else if (sessionStatus === "unauthenticated") {
      router.push("/");
    }
  }, [sessionStatus, session, router]);

  return (
    <>
      <Head>
        <title>Welcome to Tracktr.</title>
      </Head>

      <div className="pt-24">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <div className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Welcome to tracktr</div>
        </div>
      </div>
    </>
  );
};

export default WelcomeMoviesPage;
