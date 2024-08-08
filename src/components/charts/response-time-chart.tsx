"use client";

import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { HealthCheck } from "@/lib/types";

const chartConfig = {
  response_time: {
    label: "Response Time",
    color: "hsl(var(--chart-3))",
  }
} satisfies ChartConfig;

type HealthCheckChartProps = {
  healthChecks: HealthCheck[];
};

export default function ResponseTimeChart({ healthChecks }: HealthCheckChartProps) {
  const [activeChart] = React.useState<keyof typeof chartConfig>("response_time");

  const total = React.useMemo(
    () => ({
      response_time: healthChecks.reduce((acc, curr) => acc + curr.response_time, 0),
    }),
    [healthChecks]
  );

  // Ensure that `checked_at` is a valid Date string for rendering
  const data = React.useMemo(() => {
    return healthChecks.map((item) => ({
      ...item,
      checked_at: new Date(item.checked_at).toISOString(), // Ensure date is in ISO format
    }));
  }, [healthChecks]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Health Check Response Times</CardTitle>
          <CardDescription>
            Showing total response time for the latest checks
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            data={data} // Use the data with formatted dates
            margin={{
              left: 12,
              right: 12,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="checked_at"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickFormatter={(value) => `${Math.round(value)} ms`}
              domain={[0, 'dataMax']}
              tickCount={5}
              allowDecimals={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelKey="checked_at"
                  nameKey={activeChart}
                  indicator="line" // Use a line indicator
                  hideLabel={false}
                  hideIndicator={false}
                  style={{ color: 'gray' }} // Apply gray color to the indicator
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
