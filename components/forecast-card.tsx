"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getWeatherDescription } from "@/lib/weather"

interface ForecastCardProps {
  date: string
  temperatureMax: number
  temperatureMin: number
  weatherCode: number
  precipitation: number
  isToday?: boolean
}

export function ForecastCard({
  date,
  temperatureMax,
  temperatureMin,
  weatherCode,
  precipitation,
  isToday = false,
}: ForecastCardProps) {
  const weatherInfo = getWeatherDescription(weatherCode)
  const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" })
  const dayDate = new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })

  return (
    <Card className={`transition-all hover:shadow-md ${isToday ? "ring-2 ring-primary" : ""}`}>
      <CardContent className="p-4 text-center">
        {isToday && (
          <Badge variant="default" className="mb-2">
            Today
          </Badge>
        )}
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{dayName}</div>
        <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">{dayDate}</div>
        <div className="text-3xl mb-2">{weatherInfo.icon}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 min-h-[2rem] flex items-center justify-center">
          {weatherInfo.description}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">{temperatureMax}°</span>
            <span className="text-sm text-gray-500">{temperatureMin}°</span>
          </div>
          {precipitation > 0 && (
            <div className="text-xs text-blue-600 dark:text-blue-400">{precipitation.toFixed(1)}mm rain</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
