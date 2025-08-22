"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getWeatherDescription } from "@/lib/weather"

interface HourlyForecastProps {
  hourlyData: {
    time: string[]
    temperature: number[]
    weatherCode: number[]
    precipitation: number[]
  }
}

export function HourlyForecast({ hourlyData }: HourlyForecastProps) {
  const next12Hours = hourlyData.time.slice(0, 12).map((time, index) => ({
    time,
    temperature: hourlyData.temperature[index],
    weatherCode: hourlyData.weatherCode[index],
    precipitation: hourlyData.precipitation[index],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {next12Hours.map((hour, index) => {
              const weatherInfo = getWeatherDescription(hour.weatherCode)
              const hourTime = new Date(hour.time).toLocaleTimeString("en-US", {
                hour: "numeric",
                hour12: true,
              })

              return (
                <div
                  key={index}
                  className="flex flex-col items-center min-w-[80px] p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{index === 0 ? "Now" : hourTime}</div>
                  <div className="text-2xl mb-2">{weatherInfo.icon}</div>
                  <div className="text-sm font-semibold mb-1">{hour.temperature}°</div>
                  {hour.precipitation > 0 && (
                    <div className="text-xs text-blue-600 dark:text-blue-400">{hour.precipitation.toFixed(1)}mm</div>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
