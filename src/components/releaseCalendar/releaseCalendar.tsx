import {
  addMonths,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { trpc } from "../../utils/trpc";
import { useEffect, useState } from "react";
import capitalizeFirstLetter from "../../utils/capitalize";
import { enGB } from "date-fns/locale";
import Link from "next/link";
import groupBy from "../../utils/groupBy";

interface IEvent {
  title: string;
  start: any;
  end: any;
  url: string;
}

const ReleaseCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [groupedEvents, setGroupedEvents] = useState<any[]>([]);

  const currentMonthWeeks = eachWeekOfInterval(
    {
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    },
    { weekStartsOn: 1 },
  );
  const currentMonth = currentDate.getMonth() + 1;

  const { data, isLoading } = trpc.calendar.get.useQuery({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  useEffect(() => {
    if (data && data.events.length > 0) {
      setGroupedEvents(groupBy("start")(data.events));
    }
  }, [data]);

  return (
    <div>
      <div className="text-xl font-bold text-center">
        {capitalizeFirstLetter(format(currentDate, "MMMM yyyy", { locale: enGB }))}
      </div>
      <div className="flex justify-between gap-4 mx-2 my-2">
        <button
          disabled={isLoading}
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="px-2 py-1 text-sm text-black rounded bg-primary hover:bg-primary/90"
        >
          Last month
        </button>
        <button
          disabled={isLoading}
          onClick={() => setCurrentDate(new Date())}
          className="px-2 py-1 hover:bg-[#343434]"
        >
          Today
        </button>
        <button
          disabled={isLoading}
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="px-2 py-1 text-sm text-black rounded bg-primary hover:bg-primary/90"
        >
          Next month
        </button>
      </div>

      <div className={`md:grid grid-cols-7 text-center ${isLoading ? "opacity-50" : "opacity-100"} hidden`}>
        {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
          <div key={day} className="font-bold">
            {day}
          </div>
        ))}
        {currentMonthWeeks.flatMap((weekStart) =>
          eachDayOfInterval({
            start: startOfWeek(weekStart, { weekStartsOn: 1 }),
            end: endOfWeek(weekStart, { weekStartsOn: 1 }),
          }).map((day) => (
            <div key={day.toString()} className="border p-2 min-h-[100px] hover:bg-[#343434]">
              {day.getMonth() + 1 === currentMonth ? (
                <span
                  className={`text-text-body ${
                    formatDay(new Date()) === formatDay(day) && "bg-primary rounded-full text-black p-2"
                  }`}
                >
                  {day.getDate()}
                </span>
              ) : (
                <span className="text-gray-500">{day.getDate()}</span>
              )}
              {data &&
                data.events.length > 0 &&
                data.events
                  .filter((item) => formatDay(item.start) === formatDay(day))
                  .map((event, index) => {
                    return (
                      <Link
                        href={event.url}
                        key={index}
                        className="flex p-1 my-1 text-sm text-black rounded bg-primary"
                      >
                        {event.title}
                      </Link>
                    );
                  })}
            </div>
          )),
        )}
      </div>

      <div className={`block md:hidden ${isLoading ? "opacity-50" : "opacity-100"}`}>
        {groupedEvents.length > 0 &&
          groupedEvents.map((date, i) => {
            return (
              <div key={i} className="my-2">
                <div className={`font-bold ${isSameDay(date.type, new Date()) && "bg-primary"}`}>
                  {format(date.type, "d MMMM yyy")}
                </div>
                {date.start.map((event: IEvent) => {
                  return (
                    <div key={event.url}>
                      <Link href={event.url}>{event.title}</Link>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

const formatDay = (day: Date): string => {
  return format(day, "yyyy-MM-dd");
};

export default ReleaseCalendar;
