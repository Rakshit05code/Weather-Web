"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info, Shield, Sun, Wind, Droplets } from "lucide-react"
import type { WeatherData } from "@/lib/weather"

interface WeatherAlertsProps {
  weatherData: WeatherData
}

interface WeatherAlert {
  type: "warning" | "info" | "danger"
  title: string
  description: string
  icon: React.ReactNode
}

export function WeatherAlerts({ weatherData }: WeatherAlertsProps) {
  const { current, daily, airQuality } = weatherData
  const alerts: WeatherAlert[] = []

  // UV Index alerts
  if (current.uvIndex > 7) {
    alerts.push({
      type: "warning",
      title: "High UV Index",
      description: `UV index is ${current.uvIndex}. Wear sunscreen, protective clothing, and limit sun exposure during peak hours.`,
      icon: <Sun className="h-4 w-4" />,
    })
  }

  // Air quality alerts
  if (airQuality && airQuality.aqi > 100) {
    alerts.push({
      type: airQuality.aqi > 150 ? "danger" : "warning",
      title: "Air Quality Alert",
      description: `Air quality index is ${airQuality.aqi}. Consider limiting outdoor activities, especially for sensitive individuals.`,
      icon: <Shield className="h-4 w-4" />,
    })
  }

  // Wind alerts
  if (current.windSpeed > 30) {
    alerts.push({
      type: "warning",
      title: "Strong Winds",
      description: `Wind speed is ${current.windSpeed} km/h. Be cautious when driving and secure loose objects.`,
      icon: <Wind className="h-4 w-4" />,
    })
  }

  // Precipitation alerts
  const todayRain = daily.precipitation[0]
  if (todayRain > 10) {
    alerts.push({
      type: "info",
      title: "Heavy Rain Expected",
      description: `${todayRain.toFixed(1)}mm of rain expected today. Carry an umbrella and allow extra travel time.`,
      icon: <Droplets className="h-4 w-4" />,
    })
  }

  // Visibility alerts
  if (current.visibility < 5) {
    alerts.push({
      type: "warning",
      title: "Reduced Visibility",
      description: `Visibility is only ${current.visibility} km. Drive carefully and use headlights if necessary.`,
      icon: <AlertTriangle className="h-4 w-4" />,
    })
  }

  // Temperature extremes
  if (current.temperature > 35) {
    alerts.push({
      type: "danger",
      title: "Extreme Heat",
      description: `Temperature is ${current.temperature}°C. Stay hydrated, seek shade, and avoid prolonged sun exposure.`,
      icon: <AlertTriangle className="h-4 w-4" />,
    })
  } else if (current.temperature < -10) {
    alerts.push({
      type: "danger",
      title: "Extreme Cold",
      description: `Temperature is ${current.temperature}°C. Dress warmly in layers and limit time outdoors.`,
      icon: <AlertTriangle className="h-4 w-4" />,
    })
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-green-500" />
            Weather Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600">
              All Clear
            </Badge>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              No weather alerts or warnings at this time.
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Weather Alerts
          <Badge variant="outline" className="ml-auto">
            {alerts.length} Alert{alerts.length !== 1 ? "s" : ""}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => (
          <Alert key={index} variant={alert.type === "danger" ? "destructive" : "default"}>
            <div className="flex items-start gap-2">
              {alert.icon}
              <div className="flex-1">
                <div className="font-semibold text-sm">{alert.title}</div>
                <AlertDescription className="text-xs mt-1">{alert.description}</AlertDescription>
              </div>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}
