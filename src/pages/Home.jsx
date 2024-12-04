import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Home() {
    const [query, setQuery] = useState("");
    const [weather, setWeather] = useState({});

    const fetchWeather = async (e) => {
        if (query) {
            try {
                // First API call to get the geographical coordinates
                const geoResponse = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
                    params: {
                        q: query,
                        limit: 1,
                        appid: 'd44f61f522710ee945669091dc01941a' 
                    }
                });

                if (geoResponse.data.length > 0) {
                    const { lat, lon } = geoResponse.data[0];

                    // Second API call to get the weather data using the coordinates
                    const weatherResponse = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
                        params: {
                            lat: lat,
                            lon: lon,
                            exclude: 'minutely,hourly', 
                            appid: 'd44f61f522710ee945669091dc01941a' 
                        }
                    });

                    console.log(weatherResponse.data);
                    setWeather(weatherResponse.data || {});
                } else {
                    console.error('No location found for the given query.');
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        }
    }

    return (
        <div>
            <h1>Search for Your Weather Forecast</h1>
            <input type="text"
            placeholder="Enter your city" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} />
            <button onClick={fetchWeather}>Search</button>
            <div>
                {weather.name}
            </div>
        </div>
    )
}