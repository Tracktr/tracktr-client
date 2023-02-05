import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const WelcomeSeriesPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
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
          <div className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Everything is setup!</div>
          <div>Thank you for creating an account❤️</div>
          <Link href="/dashboard">
            <a className="inline-flex items-center px-6 py-4 mt-6 font-semibold text-black transition-all duration-200 rounded-full bg-primary lg:mt-16">
              Go to dashboard
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default WelcomeSeriesPage;
