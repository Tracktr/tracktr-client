import Head from "next/head";
import { useEffect, useState } from "react";
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
  const [date, setDate] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(),
  });
  const { data } = trpc.calendar.get.useQuery({
    start: date?.start,
    end: date?.end,
  });

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

      <LoadingPageComponents status={session.status === "authenticated" ? "success" : "loading"}>
        {() => (
          <div className="max-w-6xl pb-4 m-auto">
            <div className="px-4 pt-16">
              <h1 className="my-4 text-4xl">Release calendar</h1>
              <FullCalendar
                plugins={[dayGridPlugin, listPlugin]}
                initialView="dayGridMonth"
                events={data?.events || []}
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
                datesSet={(dateInfo) => {
                  setDate({
                    start: dateInfo.start,
                    end: dateInfo.end,
                  });
                }}
                aspectRatio={1.5}
                dayMaxEventRows
              />
            </div>
          </div>
        )}
      </LoadingPageComponents>
    </>
  );
};

export default CalendarPage;
