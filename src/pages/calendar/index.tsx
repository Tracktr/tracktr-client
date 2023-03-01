import Head from "next/head";
import { createRef, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import useWindowSize from "../../utils/useWindowSize";

const CalendarPage = () => {
  const windowSize = useWindowSize();
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
  const calendarComponentRef: any = createRef<FullCalendar>();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/404");
    }
  }, [session, router]);

  const handleWindowResize = () => {
    const calendar = calendarComponentRef.current.getApi();

    if (windowSize?.width && windowSize.width >= 1024) {
      calendar.changeView("dayGridMonth");
      calendar.setOption("headerToolbar", {
        start: "title",
        center: "",
        end: "dayGridMonth listMonth today prev,next",
      });
      calendar.setOption("aspectRatio", 1.5);
    } else {
      calendar.changeView("listMonth");
      calendar.setOption("headerToolbar", {
        start: "title",
        center: "",
        end: "prev,next",
      });
      calendar.setOption("aspectRatio", undefined);
    }
  };

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
                ref={calendarComponentRef}
                plugins={[dayGridPlugin, listPlugin]}
                initialView={windowSize?.width && windowSize.width >= 1024 ? "dayGridMonth" : "listMonth"}
                events={data?.events || []}
                displayEventTime={false}
                showNonCurrentDates={false}
                fixedWeekCount={false}
                headerToolbar={{
                  start: "title",
                  center: "",
                  end: `${windowSize?.width && windowSize.width >= 1024 && "dayGridMonth listMonth today "}prev,next`,
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
                aspectRatio={windowSize?.width && windowSize.width >= 1024 ? 1.5 : undefined}
                dayMaxEventRows
                handleWindowResize
                windowResize={handleWindowResize}
              />
            </div>
          </div>
        )}
      </LoadingPageComponents>
    </>
  );
};

export default CalendarPage;
