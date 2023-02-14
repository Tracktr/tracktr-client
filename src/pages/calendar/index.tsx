import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";
import { useCallback, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingPageComponents from "../../components/common/LoadingPageComponents";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const CalendarPage = () => {
  const router = useRouter();
  const session = useSession();
  const { data, status } = trpc.calendar.get.useQuery();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/404");
    }
  }, [session, router]);

  const dayPropGetter = useCallback(
    (date: Date) => ({
      ...(date.getDate() === new Date().getDate() && {
        style: {
          backgroundColor: "#343434",
        },
      }),
      ...(date.getMonth() !== new Date().getMonth() && {
        style: {
          backgroundColor: "#282828",
        },
      }),
    }),
    []
  );

  const eventPropGetter = useCallback(
    () => ({
      ...{
        style: {
          fontSize: "12px",
          lineHeight: "16px",
          backgroundColor: "#FAC42C",
          color: "#000",
        },
      },
    }),
    []
  );

  const selectItem = (event: any) => {
    router.push(event.url);
  };

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
              <Calendar
                localizer={localizer}
                events={data?.events}
                style={{ height: 500 }}
                toolbar={false}
                dayPropGetter={dayPropGetter}
                eventPropGetter={eventPropGetter}
                onSelectEvent={selectItem}
              />
            </div>
          </div>
        )}
      </LoadingPageComponents>
    </>
  );
};

export default CalendarPage;
