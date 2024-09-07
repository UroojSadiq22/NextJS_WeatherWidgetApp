"use client"
import { useState, ChangeEvent, FormEvent } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card" 
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Car, CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react"

export default function WeatherWidget(){
type WeatherData = {
    temperature:number
    description: string
    location:string
    unit: string
}

    const [location, setLocation] = useState("")
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const trimmedLocation = location.trim()
        if(trimmedLocation === ""){
            setError("Please enter a valid location.")
            setWeather(null)
            return
        }

        setIsLoading(true)
        setError(null)

        try{
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`)
            if(!response.ok){
                throw new Error("City not found")
            }
            const data = await response.json()
            const weatherData = {
                temperature: data.current.temp_c,
                description: data.current.condition.text,
                location: data.location.name,
                unit: "C"
            }
            setWeather(weatherData)
        }
        catch (error){
            console.error("Error fetching weather data:", error);            
            setError("City not found. Please try again")
            setWeather(null)
        }
        finally{
            setIsLoading(false)
        }
    }

    const handleClear = () => {
        setWeather(null)
        setError(null)
        setLocation("")
    }

    function getTemperatureMessage(temperature:number , unit:string){
        if(unit === "C"){
            if(temperature < 0){
                return `It's freezing at ${temperature}°C. Bundle up!`
            } else if(temperature < 10){
                return `It's quite cold at ${temperature}°C. Wear warm clothes.`
            } else if(temperature < 20){
                return `The temperature is ${temperature}°C. Comfortable for a light jacket.`
            } else if(temperature < 30){
                return `It's a pleasant ${temperature}°C. Enjoy the nice weather!`
            } else {
                return `It's hot at ${temperature}°C. Stay hydrated!`
            }
        }
        else{
            return `${temperature}°${unit}`
        }
    }

    function getWeatherMessage(description: string){
        switch(description.toLowerCase()){
            case "sunny":
                return "It's a beautiful sunny day!"
            case "partly cloudy":
                return "Expect some clouds and sunshine."
            case "cloudy":
                return "It's cloudy today!"
            case "overcast":
                return "The sky is overcast"
            case "rain":
                return "Don't forget your umbrella! It's raining."
            case "thunderstorm":
                return "Thunderstorms are expected today."
            case "snow":
                return "Bundle up! It's snowing."
            case "mist":
                return "It's misty outside."
            case "fog":
                return "Be careful, there's fog outside."
            default:
                return description
        }
    }

    function getLocationMessage(location: string){
        const currentHour = new Date().getHours()
        const isNight = currentHour >= 18 || currentHour < 6
        return `${location} ${isNight ? "- at Night" : "- during the Day"}`
    }

    return(
        <div className="flex justify-center items-center min-h-screen bg-weather relative px-4 sm:px-6 md:px-8">
          <div className="relative z-1 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
          <Card className="p-4 sm:p-6 md:p-8 text-center bg-gradient-to-br from-blue-500 to-gray-800 dark:from-blue-900 dark:to-gray-900 border-[3px] border-black">
                <CardHeader>
                    <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold">Weather Widget</CardTitle>
                    <CardDescription className="text-sm md:text-base text-white">
                        Search for the current weather conditions in your city.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch}
                    className="flex flex-col items-center gap-2">
                        <Input type="text"
                        placeholder="Enter a city name"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-2 py-1 md:py-2"/>

                        <div className="flex items-center gap-2 mt-2">
                        <Button type="submit" disabled={isLoading} className="hover:bg-gray-500 hover:text-black">
                            {isLoading ? "Loading..." : "Search"}
                        </Button>
                        <Button type="button" onClick={handleClear} className="hover:bg-gray-500 hover:text-black">
                            Clear
                        </Button>
                        </div>

                        
                    </form>
                    {error && <div className="mt-4 text-red-500">{error}</div>}

                    {weather && (
                        <div className="mt-8 grid gap-2 text-white transition-opacity duration-1000 ease-in-out opacity-0 animate-fade-in">
                            <div className="flex items-center gap-2">
                                <ThermometerIcon className="w-6 h-6 flex-shrink-0 text-black"/>
                                {getTemperatureMessage(weather.temperature, weather.unit)}
                            </div>
                            <div className="flex items-center gap-2">
                                <CloudIcon className="w-6 h-6 flex-shrink-0 text-black"/>
                                <div>{getWeatherMessage(weather.description)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="w-6 h-6 flex-shrink-0 text-black"/>
                                <div>{getLocationMessage(weather.location)}</div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card></div>  
        </div>
    )

}