import axios from "axios";
import React, { useState } from "react";

export default function Home() {
    const [query, setQuery] = useState("");
    const [weather, setWeather] = useState({});
    const [location, setLocation] = useState({});

    const getLocation = async () => {
        if (query) {
            try {
                const response = await axios.get(
                    `http://api.openweathermap.org/geo/1.0/direct`,
                    {
                        params: {
                            q: query,
                            appid: import.meta.env.VITE_REACT_APP_WEATHER_API_KEY,
                        },
                    }
                );
                const locationData = response.data[0] || {};
                setLocation(locationData);
                return locationData;
            } catch (error) {
                console.error('Error fetching location data:', error);
            }
        }
    };

    const fetchWeather = async (e) => {
        e.preventDefault();
        const locationData = await getLocation();
        if (locationData.lat && locationData.lon) {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast`, {
                        params: {
                            lat: locationData.lat,
                            lon: locationData.lon,
                            units: "metric",
                            appid: import.meta.env.VITE_REACT_APP_WEATHER_API_KEY,
                        }
                    });
                console.log(response.data);
                setWeather(response.data || {});
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        }
    };

    return (
        <div>
            <h1>Search for Your Weather Forecast</h1>
            <input type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} />
            <button onClick={fetchWeather}>Search</button>
            <div>
                {weather.list && weather.list.length > 0 && (
                    <div>
                        <h2>Forecast</h2>
                        <p>Temperature: {weather.list[0].main.temp}°C</p>
                        <p>Weather: {weather.list[0].weather[0].description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}