import Head from "next/head";
import { useEffect } from "react";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";

const CalendarPage = () => {
  const router = useRouter();
  const session = useSession();
  const { data, status } = trpc.calendar.get.useQuery();

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

      <LoadingPageComponents status={status}>
        {() => (
          <div className="max-w-6xl m-auto">
            <div className="pt-16 m-auto">
              <h1 className="my-4 text-4xl">Release calendar</h1>
              <FullCalendar
                plugins={[dayGridPlugin, listPlugin]}
                initialView="dayGridMonth"
                events={data?.events ? data.events : []}
                displayEventTime={false}
                showNonCurrentDates={false}
                fixedWeekCount={false}
                headerToolbar={{
                  start: "title",
                  center: "",
                  end: "dayGridMonth listMonth today prev,next",
                }}
                buttonText={{
                  today: "Today",
                  month: "Month",
                  list: "List",
                }}
              />
            </div>
          </div>
        )}
      </LoadingPageComponents>
    </>
  );
};

export default CalendarPage;
