import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";
import { useCallback } from "react";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarPage = () => {
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

  return (
    <>
      <Head>
        <title>Calendar - Tracktr.</title>
      </Head>

      <div className="max-w-6xl m-auto">
        <div className="pt-24 m-auto">
          <Calendar
            localizer={localizer}
            events={[
              {
                title: "Hi mom",
                start: new Date("December 10, 2022 00:00:00"),
                end: new Date("December 10, 2022 00:00:00"),
              },
            ]}
            style={{ height: 500 }}
            toolbar={false}
            dayPropGetter={dayPropGetter}
          />
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
