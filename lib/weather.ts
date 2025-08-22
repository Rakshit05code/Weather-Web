// Weather API utilities using Open-Meteo (free, no API key required)

export interface WeatherData {
  current: {
    temperature: number
    humidity: number
    windSpeed: number
    windDirection: number
    weatherCode: number
    isDay: boolean
    uvIndex: number
    visibility: number
    pressure: number
    dewPoint: number
  }
  hourly: {
    time: string[]
    temperature: number[]
    weatherCode: number[]
    precipitation: number[]
    uvIndex: number[]
    visibility: number[]
  }
  daily: {
    time: string[]
    temperatureMax: number[]
    temperatureMin: number[]
    weatherCode: number[]
    precipitation: number[]
    sunrise: string[]
    sunset: string[]
    uvIndexMax: number[]
  }
  airQuality?: {
    aqi: number
    pm25: number
    pm10: number
    no2: number
    o3: number
    so2: number
  }
}

export interface LocationData {
  name: string
  country: string
  latitude: number
  longitude: number
}

// Weather code mappings for Open-Meteo
export const weatherCodeMap: Record<number, { description: string; icon: string }> = {
  0: { description: "Clear sky", icon: "☀️" },
  1: { description: "Mainly clear", icon: "🌤️" },
  2: { description: "Partly cloudy", icon: "⛅" },
  3: { description: "Overcast", icon: "☁️" },
  45: { description: "Fog", icon: "🌫️" },
  48: { description: "Depositing rime fog", icon: "🌫️" },
  51: { description: "Light drizzle", icon: "🌦️" },
  53: { description: "Moderate drizzle", icon: "🌦️" },
  55: { description: "Dense drizzle", icon: "🌧️" },
  61: { description: "Slight rain", icon: "🌧️" },
  63: { description: "Moderate rain", icon: "🌧️" },
  65: { description: "Heavy rain", icon: "⛈️" },
  71: { description: "Slight snow", icon: "🌨️" },
  73: { description: "Moderate snow", icon: "❄️" },
  75: { description: "Heavy snow", icon: "❄️" },
  95: { description: "Thunderstorm", icon: "⛈️" },
}

export async function searchLocations(query: string): Promise<LocationData[]> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`,
    )

    if (!response.ok) {
      throw new Error("Failed to search locations")
    }

    const data = await response.json()

    return (
      data.results?.map((result: any) => ({
        name: result.name,
        country: result.country,
        latitude: result.latitude,
        longitude: result.longitude,
      })) || []
    )
  } catch (error) {
    console.error("Error searching locations:", error)
    return []
  }
}

export async function getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
  try {
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,is_day,uv_index,visibility,surface_pressure,dew_point_2m&hourly=temperature_2m,weather_code,precipitation,uv_index,visibility&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=7`,
    )

    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const weatherData = await weatherResponse.json()

    let airQuality = undefined
    try {
      const airQualityResponse = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,sulphur_dioxide`,
      )

      if (airQualityResponse.ok) {
        const airData = await airQualityResponse.json()
        airQuality = {
          aqi: airData.current.us_aqi || 0,
          pm25: airData.current.pm2_5 || 0,
          pm10: airData.current.pm10 || 0,
          no2: airData.current.nitrogen_dioxide || 0,
          o3: airData.current.ozone || 0,
          so2: airData.current.sulphur_dioxide || 0,
        }
      }
    } catch (error) {
      console.warn("Air quality data unavailable:", error)
    }

    return {
      current: {
        temperature: Math.round(weatherData.current.temperature_2m),
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: Math.round(weatherData.current.wind_speed_10m),
        windDirection: weatherData.current.wind_direction_10m,
        weatherCode: weatherData.current.weather_code,
        isDay: weatherData.current.is_day === 1,
        uvIndex: Math.round(weatherData.current.uv_index || 0),
        visibility: Math.round(weatherData.current.visibility / 1000),
        pressure: Math.round(weatherData.current.surface_pressure),
        dewPoint: Math.round(weatherData.current.dew_point_2m),
      },
      hourly: {
        time: weatherData.hourly.time.slice(0, 24),
        temperature: weatherData.hourly.temperature_2m.slice(0, 24).map((temp: number) => Math.round(temp)),
        weatherCode: weatherData.hourly.weather_code.slice(0, 24),
        precipitation: weatherData.hourly.precipitation.slice(0, 24),
        uvIndex: weatherData.hourly.uv_index.slice(0, 24).map((uv: number) => Math.round(uv || 0)),
        visibility: weatherData.hourly.visibility.slice(0, 24).map((vis: number) => Math.round(vis / 1000)),
      },
      daily: {
        time: weatherData.daily.time,
        temperatureMax: weatherData.daily.temperature_2m_max.map((temp: number) => Math.round(temp)),
        temperatureMin: weatherData.daily.temperature_2m_min.map((temp: number) => Math.round(temp)),
        weatherCode: weatherData.daily.weather_code,
        precipitation: weatherData.daily.precipitation_sum,
        sunrise: weatherData.daily.sunrise,
        sunset: weatherData.daily.sunset,
        uvIndexMax: weatherData.daily.uv_index_max.map((uv: number) => Math.round(uv || 0)),
      },
      airQuality,
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}

export function getWeatherDescription(code: number): { description: string; icon: string } {
  return weatherCodeMap[code] || { description: "Unknown", icon: "❓" }
}

export function getUVIndexDescription(uvIndex: number): { level: string; description: string; color: string } {
  if (uvIndex <= 2) return { level: "Low", description: "Minimal protection needed", color: "text-green-600" }
  if (uvIndex <= 5) return { level: "Moderate", description: "Some protection recommended", color: "text-yellow-600" }
  if (uvIndex <= 7) return { level: "High", description: "Protection essential", color: "text-orange-600" }
  if (uvIndex <= 10) return { level: "Very High", description: "Extra protection required", color: "text-red-600" }
  return { level: "Extreme", description: "Avoid sun exposure", color: "text-purple-600" }
}

export function getAirQualityDescription(aqi: number): { level: string; description: string; color: string } {
  if (aqi <= 50) return { level: "Good", description: "Air quality is satisfactory", color: "text-green-600" }
  if (aqi <= 100) return { level: "Moderate", description: "Acceptable for most people", color: "text-yellow-600" }
  if (aqi <= 150)
    return {
      level: "Unhealthy for Sensitive",
      description: "Sensitive groups may be affected",
      color: "text-orange-600",
    }
  if (aqi <= 200) return { level: "Unhealthy", description: "Everyone may be affected", color: "text-red-600" }
  if (aqi <= 300) return { level: "Very Unhealthy", description: "Health warnings", color: "text-purple-600" }
  return { level: "Hazardous", description: "Emergency conditions", color: "text-red-800" }
}

export function getWindDirection(degrees: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ]
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

export function formatTime(timeString: string): string {
  return new Date(timeString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export async function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  })
}
