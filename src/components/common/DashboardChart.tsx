import { Bar, BarChart, ResponsiveContainer, Text, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { IStatItem } from "../../server/trpc/router/dashboard";

interface IDashboardChartProps {
  stats: { history: IStatItem[]; episodeAmount: number; movieAmount: number } | undefined;
}

const DashboardChart = ({ stats }: IDashboardChartProps) => {
  const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length)
      return (
        <div className="px-5 py-2 text-sm text-black rounded-full shadow-xl outline-none bg-primary active:border-none">{`Watched ${
          payload[0] !== undefined && payload[0].value
        } items`}</div>
      );

    return null;
  };

  const CustomXAxisTick = ({ x, y, payload }: any) => {
    if (payload && payload.value && payload.value !== "auto") {
      return (
        <Text fontSize={"0.5rem"} width={"0.5rem"} x={x} y={y} textAnchor="middle" verticalAnchor="start">
          {payload.value.toLocaleDateString("en-UK", {
            month: "2-digit",
            day: "numeric",
          })}
        </Text>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={stats?.history} margin={{ left: -50 }}>
        <XAxis dataKey="date" allowDecimals={false} interval={0} tick={<CustomXAxisTick />} />
        <YAxis dataKey="count" allowDecimals={false} tick={false} />
        <Bar dataKey="count" fill="#f9bd13" />
        <Tooltip wrapperStyle={{ outline: "none" }} cursor={false} content={<CustomTooltip />} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DashboardChart;
