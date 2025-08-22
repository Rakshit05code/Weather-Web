"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WeatherChartProps {
  data: Array<{
    time: string
    temperature: number
    precipitation: number
  }>
  title: string
}

export function WeatherChart({ data, title }: WeatherChartProps) {
  const chartData = data.map((item) => ({
    time: new Date(item.time).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    }),
    temperature: item.temperature,
    precipitation: item.precipitation,
  }))

  return (
    <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600 opacity-50" />
            <XAxis
              dataKey="time"
              fontSize={12}
              tick={{ fill: "#374151" }}
              className="dark:[&_.recharts-text]:fill-gray-300"
              stroke="#9ca3af"
            />
            <YAxis
              fontSize={12}
              tick={{ fill: "#374151" }}
              className="dark:[&_.recharts-text]:fill-gray-300"
              stroke="#9ca3af"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                color: "#374151",
              }}
              className="dark:[&>div]:!bg-gray-800 dark:[&>div]:!border-gray-600 dark:[&>div]:!text-gray-200"
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{
                fill: "#3b82f6",
                strokeWidth: 2,
                r: 5,
                stroke: "#ffffff",
              }}
              activeDot={{
                r: 7,
                fill: "#1d4ed8",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              name="Temperature (°C)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
