"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sun, Eye, Gauge, Droplets, Wind, Sunrise, Sunset, Shield, Activity } from "lucide-react"
import {
  getUVIndexDescription,
  getAirQualityDescription,
  getWindDirection,
  formatTime,
  type WeatherData,
} from "@/lib/weather"

interface AdvancedWeatherMetricsProps {
  weatherData: WeatherData
}

export function AdvancedWeatherMetrics({ weatherData }: AdvancedWeatherMetricsProps) {
  const { current, daily, airQuality } = weatherData
  const uvInfo = getUVIndexDescription(current.uvIndex)
  const airQualityInfo = airQuality ? getAirQualityDescription(airQuality.aqi) : null

  const todaySunrise = daily.sunrise[0] ? formatTime(daily.sunrise[0]) : "N/A"
  const todaySunset = daily.sunset[0] ? formatTime(daily.sunset[0]) : "N/A"

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* UV Index */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sun className="h-4 w-4 text-yellow-500" />
            UV Index
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{current.uvIndex}</span>
              <Badge variant="outline" className={uvInfo.color}>
                {uvInfo.level}
              </Badge>
            </div>
            <Progress value={(current.uvIndex / 11) * 100} className="h-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400">{uvInfo.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Air Quality */}
      {airQuality && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              Air Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{airQuality.aqi}</span>
                <Badge variant="outline" className={airQualityInfo?.color}>
                  {airQualityInfo?.level}
                </Badge>
              </div>
              <Progress value={(airQuality.aqi / 300) * 100} className="h-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400">{airQualityInfo?.description}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visibility */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-500" />
            Visibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <span className="text-2xl font-bold">{current.visibility} km</span>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {current.visibility > 10
                ? "Excellent visibility"
                : current.visibility > 5
                  ? "Good visibility"
                  : current.visibility > 2
                    ? "Moderate visibility"
                    : "Poor visibility"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Atmospheric Pressure */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Gauge className="h-4 w-4 text-purple-500" />
            Pressure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <span className="text-2xl font-bold">{current.pressure} hPa</span>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {current.pressure > 1020 ? "High pressure" : current.pressure > 1000 ? "Normal pressure" : "Low pressure"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dew Point */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Droplets className="h-4 w-4 text-cyan-500" />
            Dew Point
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <span className="text-2xl font-bold">{current.dewPoint}°C</span>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {current.dewPoint > 20
                ? "Very humid"
                : current.dewPoint > 15
                  ? "Humid"
                  : current.dewPoint > 10
                    ? "Comfortable"
                    : "Dry"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Wind Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Wind className="h-4 w-4 text-blue-500" />
            Wind Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{current.windSpeed} km/h</span>
              <Badge variant="outline">{getWindDirection(current.windDirection)}</Badge>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Direction: {current.windDirection}°</p>
          </div>
        </CardContent>
      </Card>

      {/* Sunrise & Sunset */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sunrise className="h-4 w-4 text-orange-500" />
            Sun Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sunrise className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Sunrise</span>
              </div>
              <span className="font-semibold">{todaySunrise}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sunset className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Sunset</span>
              </div>
              <span className="font-semibold">{todaySunset}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Air Quality Details */}
      {airQuality && (
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              Air Quality Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{airQuality.pm25.toFixed(1)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">PM2.5 μg/m³</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">{airQuality.pm10.toFixed(1)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">PM10 μg/m³</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">{airQuality.o3.toFixed(1)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">O₃ μg/m³</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
