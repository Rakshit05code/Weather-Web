"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeatherChart } from "@/components/weather-chart"
import { ForecastCard } from "@/components/forecast-card"
import { HourlyForecast } from "@/components/hourly-forecast"
import { WeatherChatbot } from "@/components/weather-chatbot"
import { AdvancedWeatherMetrics } from "@/components/advanced-weather-metrics"
import { WeatherAlerts } from "@/components/weather-alerts"
import {
  getWeatherData,
  searchLocations,
  getCurrentLocation,
  getWeatherDescription,
  type WeatherData,
  type LocationData,
} from "@/lib/weather"
import {
  Search,
  MapPin,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Sun,
  Moon,
  MessageCircle,
  BarChart3,
  Settings,
  RefreshCw,
  Cloud,
  CloudRain,
} from "lucide-react"

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<LocationData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [showDefaultLocation, setShowDefaultLocation] = useState(false)
  const [suggestions, setSuggestions] = useState<LocationData[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    loadCurrentLocation()
  }, [])

  const loadDefaultLocation = async () => {
    try {
      setLoading(true)
      setError(null)

      const defaultLocation = {
        name: "Mumbai",
        country: "India",
        latitude: 19.076,
        longitude: 72.8777,
      }

      const weather = await getWeatherData(defaultLocation.latitude, defaultLocation.longitude)

      setCurrentLocation(defaultLocation)
      setWeatherData(weather)
      setLastUpdated(new Date())
      setShowDefaultLocation(true)
    } catch (err) {
      setError("Unable to load weather data. Please search for a city manually.")
      console.error("Default location error:", err)
    } finally {
      setLoading(false)
    }
  }

  const loadCurrentLocation = async () => {
    try {
      setLoading(true)
      setError(null)
      setShowDefaultLocation(false)

      const coords = await getCurrentLocation()
      const weather = await getWeatherData(coords.latitude, coords.longitude)

      const locations = await searchLocations(`${coords.latitude},${coords.longitude}`)
      const location = locations[0] || {
        name: "Current Location",
        country: "",
        latitude: coords.latitude,
        longitude: coords.longitude,
      }

      setCurrentLocation(location)
      setWeatherData(weather)
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Location error:", err)
      setError("Location access denied. Showing weather for Mumbai as default.")
      await loadDefaultLocation()
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      setError(null)

      const results = await searchLocations(searchQuery)
      setSearchResults(results)

      if (results.length > 0) {
        const location = results[0]
        const weather = await getWeatherData(location.latitude, location.longitude)

        setCurrentLocation(location)
        setWeatherData(weather)
        setSearchResults([])
        setSearchQuery("")
        setLastUpdated(new Date())
      } else {
        setError("No locations found. Please try a different search.")
      }
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.")
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  const selectLocation = async (location: LocationData) => {
    try {
      setLoading(true)
      setError(null)

      const weather = await getWeatherData(location.latitude, location.longitude)

      setCurrentLocation(location)
      setWeatherData(weather)
      setSearchResults([])
      setSearchQuery("")
      setLastUpdated(new Date())
    } catch (err) {
      setError("Failed to fetch weather data for this location.")
      console.error("Location selection error:", err)
    } finally {
      setLoading(false)
    }
  }

  const refreshWeatherData = async () => {
    if (!currentLocation) return

    try {
      setLoading(true)
      setError(null)

      const weather = await getWeatherData(currentLocation.latitude, currentLocation.longitude)
      setWeatherData(weather)
      setLastUpdated(new Date())
    } catch (err) {
      setError("Failed to refresh weather data.")
      console.error("Refresh error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchInput = async (value: string) => {
    setSearchQuery(value)

    if (value.length >= 2) {
      try {
        const results = await searchLocations(value)
        setSuggestions(results.slice(0, 5))
        setShowSuggestions(true)
      } catch (err) {
        setSuggestions([])
        setShowSuggestions(false)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (location: LocationData) => {
    setSearchQuery(`${location.name}, ${location.country}`)
    setShowSuggestions(false)
    selectLocation(location)
  }

  const currentWeather = weatherData?.current
  const weatherInfo = currentWeather ? getWeatherDescription(currentWeather.weatherCode) : null

  return (
    <div className="min-h-screen relative overflow-hidden dark">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black transition-all duration-1000" />

        <div className="absolute top-20 left-10 w-24 h-24 bg-blue-500/40 rounded-full blur-xl animate-float-slow" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/40 rounded-full blur-xl animate-float-medium" />
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-indigo-500/40 rounded-full blur-xl animate-float-fast" />
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-cyan-500/40 rounded-full blur-xl animate-float-slow" />
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-violet-500/30 rounded-full blur-2xl animate-float-medium" />
        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-teal-500/30 rounded-full blur-xl animate-float-fast" />

        <div className="absolute top-32 right-1/4 opacity-20 animate-bounce">
          <Cloud className="w-16 h-16 text-blue-300 drop-shadow-lg filter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        </div>
        <div className="absolute bottom-32 left-1/4 opacity-20 animate-bounce delay-1000">
          <CloudRain className="w-12 h-12 text-blue-400 drop-shadow-lg filter drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
        </div>
        <div className="absolute top-1/2 right-10 opacity-20 animate-bounce delay-2000">
          <Sun className="w-14 h-14 text-yellow-300 drop-shadow-lg filter drop-shadow-[0_0_15px_rgba(253,224,71,0.6)]" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-fade-in">
                WeatherBot
              </h1>
            </div>
          </div>
          <p className="text-base sm:text-lg text-gray-300 mb-2 animate-fade-in-up">
            AI-Powered Weather Assistant with Accurate Forecasts
          </p>
          {lastUpdated && (
            <p className="text-xs sm:text-sm text-gray-400 animate-fade-in-up delay-200">
              Last updated:{" "}
              {lastUpdated.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          )}
        </div>

        <Card className="mb-6 sm:mb-8 shadow-xl border-0 bg-gray-800/95 backdrop-blur-md transition-all duration-500 hover:shadow-2xl animate-fade-in-up delay-300">
          <CardContent className="p-4 sm:p-6">
            {showDefaultLocation && (
              <div className="bg-blue-900/40 border border-blue-700 rounded-lg p-3 mb-4 animate-slide-down">
                <div className="text-blue-300 text-sm">
                  📍 Location access was denied. Showing weather for Mumbai as default. Search for your city below or
                  click "My Location" to try again.
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                <Input
                  placeholder="Search for any city in India..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10 border-0 bg-gray-700/80 focus:ring-2 focus:ring-blue-400 transition-all duration-300 hover:bg-gray-600/80 text-gray-100 placeholder:text-gray-400"
                />

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto backdrop-blur-md">
                    {suggestions.map((location, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 text-gray-100 border-b border-gray-700 last:border-b-0 hover:shadow-lg"
                        onClick={() => selectSuggestion(location)}
                      >
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-white">{location.name}</span>
                        <span className="text-gray-400">, {location.country}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Search
                </Button>
                <Button
                  variant="outline"
                  onClick={loadCurrentLocation}
                  disabled={loading}
                  className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 transform hover:scale-105 bg-transparent"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">My Location</span>
                </Button>
                {weatherData && (
                  <Button
                    variant="outline"
                    onClick={refreshWeatherData}
                    disabled={loading}
                    size="icon"
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 transform hover:scale-105 bg-transparent"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  </Button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-300 mb-2 font-medium">Popular Indian Cities:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {[
                  { name: "Delhi", lat: 28.6139, lon: 77.209 },
                  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
                  { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
                  { name: "Chennai", lat: 13.0827, lon: 80.2707 },
                  { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
                  { name: "Hyderabad", lat: 17.385, lon: 78.4867 },
                  { name: "Pune", lat: 18.5204, lon: 73.8567 },
                  { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
                ].map((city) => (
                  <Button
                    key={city.name}
                    variant="outline"
                    size="sm"
                    className="text-xs font-medium text-white hover:text-blue-300 hover:bg-blue-900/40 bg-gray-700/80 border-gray-600 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                    onClick={() =>
                      selectLocation({
                        name: city.name,
                        country: "India",
                        latitude: city.lat,
                        longitude: city.lon,
                      })
                    }
                  >
                    {city.name}
                  </Button>
                ))}
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2 animate-slide-down">
                <p className="text-sm text-gray-400">Search Results:</p>
                {searchResults.map((location, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start hover:bg-gray-700 transition-all duration-300 transform hover:scale-[1.02]"
                    onClick={() => selectLocation(location)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {location.name}, {location.country}
                  </Button>
                ))}
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3 mt-4 animate-shake">
                <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
                {!weatherData && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-red-600 border-red-300 hover:bg-red-50 bg-transparent transition-all duration-300"
                    onClick={loadDefaultLocation}
                  >
                    Load Mumbai Weather
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {loading && !weatherData && (
          <div className="space-y-6 animate-fade-in">
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48 animate-pulse" />
                  <Skeleton className="h-16 w-full animate-pulse" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-20 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Skeleton className="h-64 w-full animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-48 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}

        {weatherData && currentLocation && (
          <div className="space-y-6 animate-fade-in-up delay-500">
            <Card className="overflow-hidden shadow-2xl border-0 transition-all duration-500 hover:shadow-3xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 animate-pulse" />
                <CardTitle className="flex items-center gap-2 relative z-10 text-white font-semibold drop-shadow-lg">
                  <MapPin className="h-5 w-5 text-white drop-shadow-sm" />
                  <span className="truncate text-white drop-shadow-sm">
                    {currentLocation.name}, {currentLocation.country}
                  </span>
                  {loading && <RefreshCw className="h-4 w-4 animate-spin ml-auto text-white" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 bg-gray-900 backdrop-blur-md">
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="text-center">
                    <div className="text-6xl sm:text-8xl mb-4 drop-shadow-lg animate-bounce-slow">
                      {weatherInfo?.icon}
                    </div>
                    <div className="text-4xl sm:text-6xl font-bold text-gray-100 mb-2 drop-shadow-sm animate-fade-in">
                      {currentWeather?.temperature}°C
                    </div>
                    <div className="text-lg sm:text-2xl text-gray-300 mb-4 animate-fade-in-up font-medium">
                      {weatherInfo?.description}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Badge
                        variant={currentWeather?.isDay ? "default" : "secondary"}
                        className="text-sm shadow-lg animate-pulse bg-blue-600 text-white dark:bg-blue-500"
                      >
                        {currentWeather?.isDay ? (
                          <>
                            <Sun className="h-4 w-4 mr-1" />
                            Day
                          </>
                        ) : (
                          <>
                            <Moon className="h-4 w-4 mr-1" />
                            Night
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <Wind className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                      <div>
                        <div className="text-xs sm:text-sm text-gray-300 font-medium">Wind Speed</div>
                        <div className="text-lg sm:text-xl font-bold text-gray-100">
                          {currentWeather?.windSpeed} km/h
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/50 dark:to-cyan-800/50 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600 dark:text-cyan-400" />
                      <div>
                        <div className="text-xs sm:text-sm text-gray-300 font-medium">Humidity</div>
                        <div className="text-lg sm:text-xl font-bold text-gray-100">{currentWeather?.humidity}%</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                      <div>
                        <div className="text-xs sm:text-sm text-gray-300 font-medium">Visibility</div>
                        <div className="text-lg sm:text-xl font-bold text-gray-100">
                          {currentWeather?.visibility} km
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <Thermometer className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
                      <div>
                        <div className="text-xs sm:text-sm text-gray-300 font-medium">Feels Like</div>
                        <div className="text-lg sm:text-xl font-bold text-gray-100">
                          {currentWeather?.temperature}°C
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="animate-fade-in-up delay-700">
              <WeatherAlerts weatherData={weatherData} />
            </div>

            <div className="animate-fade-in-up delay-1000">
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-gray-800 backdrop-blur-md shadow-xl border border-gray-200 dark:border-gray-700 h-12 sm:h-14">
                  <TabsTrigger
                    value="dashboard"
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-700 data-[state=active]:text-white transition-all duration-300 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium"
                  >
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden">Charts</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="advanced"
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-700 data-[state=active]:text-white transition-all duration-300 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium"
                  >
                    <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Advanced</span>
                    <span className="sm:hidden">Details</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="chat"
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-700 data-[state=active]:text-white transition-all duration-300 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium"
                  >
                    <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">AI Assistant</span>
                    <span className="sm:hidden">AI</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6 mt-6">
                  <div className="animate-slide-up">
                    <HourlyForecast hourlyData={weatherData.hourly} />
                  </div>

                  <div className="animate-slide-up delay-200">
                    <WeatherChart
                      data={weatherData.hourly.time.slice(0, 12).map((time, index) => ({
                        time,
                        temperature: weatherData.hourly.temperature[index],
                        precipitation: weatherData.hourly.precipitation[index],
                      }))}
                      title="12-Hour Temperature Trend"
                    />
                  </div>

                  <div className="animate-slide-up delay-400">
                    <Card className="shadow-xl border-0 bg-white dark:bg-gray-900 backdrop-blur-md">
                      <CardHeader>
                        <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">
                          7-Day Forecast
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
                          {weatherData.daily.time.map((date, index) => (
                            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                              <ForecastCard
                                date={date}
                                temperatureMax={weatherData.daily.temperatureMax[index]}
                                temperatureMin={weatherData.daily.temperatureMin[index]}
                                weatherCode={weatherData.daily.weatherCode[index]}
                                precipitation={weatherData.daily.precipitation[index]}
                                isToday={index === 0}
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6 mt-6">
                  <div className="animate-fade-in">
                    <AdvancedWeatherMetrics weatherData={weatherData} />
                  </div>
                </TabsContent>

                <TabsContent value="chat" className="mt-6">
                  <div className="animate-fade-in">
                    <WeatherChatbot weatherData={weatherData} currentLocation={currentLocation} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        <footer className="mt-12 sm:mt-16 text-center text-xs sm:text-sm text-gray-400 animate-fade-in-up delay-1200">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Sun className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <span className="font-semibold text-sm sm:text-base">WeatherBot</span>
          </div>
          <p className="mb-1">Powered by Open-Meteo API • Built with Next.js and AI</p>
          <p>© 2024 WeatherBot. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
