import { useEffect } from "react";
import { useSession } from "next-auth/react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import { useRouter } from "next/router";
import Head from "next/head";
import ReleaseCalendar from "../../components/releaseCalendar/releaseCalendar";

const CalendarPage = () => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/404");
    }
  }, [session, router]);

  return (
    <>
      <Head>
        <title>Release Calendar - Tracktr.</title>
      </Head>

      <LoadingPageComponents status={session.status === "authenticated" ? "success" : "pending"}>
        {() => (
          <div className="max-w-6xl pb-8 m-auto">
            <div className="px-4 pt-16">
              <h1 className="my-4 text-4xl">Release calendar</h1>
              <ReleaseCalendar />
            </div>
          </div>
        )}
      </LoadingPageComponents>
    </>
  );
};

export default CalendarPage;
