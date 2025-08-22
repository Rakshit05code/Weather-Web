"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { getWeatherDescription, type WeatherData, type LocationData } from "@/lib/weather"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface WeatherChatbotProps {
  weatherData: WeatherData | null
  currentLocation: LocationData | null
}

export function WeatherChatbot({ weatherData, currentLocation }: WeatherChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI weather assistant. I can help you understand weather patterns, provide detailed forecasts, and answer any weather-related questions. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const generateWeatherResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (!weatherData || !currentLocation) {
      return "I'd be happy to help with weather information! Please search for a location first so I can provide accurate weather data."
    }

    const currentWeather = weatherData.current
    const weatherInfo = getWeatherDescription(currentWeather.weatherCode)

    // Temperature related questions
    if (
      message.includes("temperature") ||
      message.includes("hot") ||
      message.includes("cold") ||
      message.includes("warm")
    ) {
      const temp = currentWeather.temperature
      let response = `The current temperature in ${currentLocation.name} is ${temp}°C. `

      if (temp > 25) {
        response += "It's quite warm today! Consider wearing light clothing and staying hydrated."
      } else if (temp < 10) {
        response += "It's quite cold today! Make sure to dress warmly and layer up."
      } else {
        response += "The temperature is comfortable for most outdoor activities."
      }

      return response
    }

    // Rain/precipitation questions
    if (message.includes("rain") || message.includes("precipitation") || message.includes("wet")) {
      const hasRain = weatherData.hourly.precipitation.some((p) => p > 0)
      const todayRain = weatherData.daily.precipitation[0]

      if (hasRain || todayRain > 0) {
        return `There's a chance of rain today in ${currentLocation.name}. Expected precipitation: ${todayRain.toFixed(1)}mm. I'd recommend carrying an umbrella or rain jacket!`
      } else {
        return `Good news! No rain is expected today in ${currentLocation.name}. It should be a dry day perfect for outdoor activities.`
      }
    }

    // Wind questions
    if (message.includes("wind") || message.includes("windy") || message.includes("breeze")) {
      const windSpeed = currentWeather.windSpeed
      let response = `The current wind speed in ${currentLocation.name} is ${windSpeed} km/h. `

      if (windSpeed > 20) {
        response += "It's quite windy today! Be careful with umbrellas and loose items."
      } else if (windSpeed < 5) {
        response += "It's very calm with minimal wind - perfect for outdoor activities."
      } else {
        response += "There's a gentle breeze, which should make the weather feel pleasant."
      }

      return response
    }

    // Humidity questions
    if (message.includes("humid") || message.includes("moisture") || message.includes("sticky")) {
      const humidity = currentWeather.humidity
      let response = `The current humidity in ${currentLocation.name} is ${humidity}%. `

      if (humidity > 70) {
        response += "It's quite humid today, which might make it feel warmer than the actual temperature."
      } else if (humidity < 30) {
        response += "The air is quite dry today. Consider using moisturizer and staying hydrated."
      } else {
        response += "The humidity level is comfortable for most people."
      }

      return response
    }

    // General weather questions
    if (message.includes("weather") || message.includes("forecast") || message.includes("today")) {
      return `Currently in ${currentLocation.name}, it's ${currentWeather.temperature}°C with ${weatherInfo.description.toLowerCase()}. The humidity is ${currentWeather.humidity}% and wind speed is ${currentWeather.windSpeed} km/h. ${currentWeather.isDay ? "It's daytime" : "It's nighttime"} right now.`
    }

    // Tomorrow questions
    if (message.includes("tomorrow")) {
      const tomorrowMax = weatherData.daily.temperatureMax[1]
      const tomorrowMin = weatherData.daily.temperatureMin[1]
      const tomorrowWeather = getWeatherDescription(weatherData.daily.weatherCode[1])

      return `Tomorrow in ${currentLocation.name}, expect ${tomorrowWeather.description.toLowerCase()} with temperatures ranging from ${tomorrowMin}°C to ${tomorrowMax}°C.`
    }

    // Week forecast questions
    if (message.includes("week") || message.includes("7 day") || message.includes("weekly")) {
      const avgTemp = Math.round(
        weatherData.daily.temperatureMax.reduce((a, b) => a + b, 0) / weatherData.daily.temperatureMax.length,
      )
      return `This week in ${currentLocation.name}, temperatures will average around ${avgTemp}°C. Check the 7-day forecast above for detailed daily predictions!`
    }

    // Clothing recommendations
    if (message.includes("wear") || message.includes("clothes") || message.includes("dress")) {
      const temp = currentWeather.temperature
      const hasRain = weatherData.daily.precipitation[0] > 0

      let recommendation = "Based on current weather, I recommend "

      if (temp > 25) {
        recommendation += "light, breathable clothing like cotton t-shirts and shorts."
      } else if (temp > 15) {
        recommendation += "comfortable clothing with a light jacket or sweater."
      } else if (temp > 5) {
        recommendation += "warm clothing with layers - a jacket, long pants, and closed shoes."
      } else {
        recommendation += "heavy winter clothing - coat, warm layers, gloves, and a hat."
      }

      if (hasRain) {
        recommendation += " Don't forget a waterproof jacket or umbrella!"
      }

      return recommendation
    }

    // Default response
    return `I can help you with weather information for ${currentLocation.name}! Try asking me about temperature, rain, wind, humidity, tomorrow's forecast, or what to wear today.`
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: generateWeatherResponse(inputValue),
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestedQuestions = [
    "What's the weather like today?",
    "Will it rain tomorrow?",
    "What should I wear?",
    "How windy is it?",
    "What's the weekly forecast?",
  ]

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Weather Assistant
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Smart
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>

                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="p-4 border-t">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputValue(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me about the weather..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
