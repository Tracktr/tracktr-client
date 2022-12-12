import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";
import { useCallback } from "react";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

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
  const { data } = trpc.calendar.get.useQuery();

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

      <div className="max-w-6xl m-auto text-">
        <div className="pt-24 m-auto">
          <h1 className="my-4 text-3xl">Release calendar</h1>
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
    </>
  );
};

export default CalendarPage;
