import React, { useState, useEffect } from "react";
import "../styles/MainContainer.css"; // Import the CSS file for MainContainer
import WeatherCard from "./WeatherCard";

function MainContainer(props) {
  function formatDate(daysFromNow = 0) {
    let output = "";
    var date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    output += date.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    output += " " + date.getDate();
    return output;
  }

  /*
  STEP 1: IMPORTANT NOTICE!

  Before you start, ensure that both App.js and SideContainer.js are complete. The reason is MainContainer 
  is dependent on the city selected in SideContainer and managed in App.js. You need the data to flow from 
  App.js to MainContainer for the selected city before making an API call to fetch weather data.
  */

  /*
  STEP 2: Manage Weather Data with State.
  
  Just like how we managed city data in App.js, we need a mechanism to manage the weather data 
  for the selected city in this component. Use the 'useState' hook to create a state variable 
  (e.g., 'weather') and its corresponding setter function (e.g., 'setWeather'). The initial state can be 
  null or an empty object.
  */

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  // other stuff for debug
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /*
  STEP 3: Fetch Weather Data When City Changes.
  */
  useEffect(() => {
    const city = props.selectedCity;
    if (!city) {
      setWeather(null);
      setForecast([]);
      setError(null);
      setLoading(false);
      return;
    }

    const { lat, lon } = city;
    const apiKey = props.apiKey;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    setLoading(true);
    setError(null);

    // i know u like this promise.all stuff yash.
    Promise.all([
      fetch(weatherUrl).then((res) => res.json()),
      fetch(forecastUrl).then((res) => res.json()),
    ])
      .then(([weatherData, forecastData]) => {
        setWeather(weatherData);

        // Filter forecast to get one reading per day (e.g., noon)
        const dailyData = forecastData.list.filter((reading) =>
          reading.dt_txt.includes("12:00:00")
        );
        setForecast(dailyData);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch data");
        setWeather(null);
        setForecast([]);
      })
      .finally(() => setLoading(false));
  }, [props.selectedCity, props.apiKey]);

  return (
    <div id="main-container">
      <div id="weather-container">
        {/* 
        STEP 4: Display Weather Data.
        
        With the fetched weather data stored in state, use conditional rendering (perhaps the ternary operator) 
        to display it here. Make sure to check if the 'weather' state has data before trying to access its 
        properties to avoid runtime errors. 

        Break down the data object and figure out what you want to display (e.g., temperature, weather description).
        This is a good section to play around with React components! Create your own - a good example could be a WeatherCard
        component that takes in props, and displays data for each day of the week.
        */}

        {!props.selectedCity && (
          <p>where dat city doe </p>
        )}

        {props.selectedCity && loading && <p>Loading... please wait...</p>}

        {props.selectedCity && error && <p>Error: {error}</p>}

        {props.selectedCity && weather && !loading && !error && (
          <div>
            <h2>{props.selectedCity.fullName}</h2>
            <div>
              <h3> Today - {formatDate(0)}</h3>
              <p>
                Temp: {weather.main.temp} °F, {weather.weather[0].description}
              </p>
            </div>

            {/* Forecast Section */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              {forecast.map((day) => (
                <WeatherCard
                  key={day.dt}
                  date={new Date(day.dt * 1000).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                  temp={day.main.temp}
                  description={day.weather[0].description}
                  icon={day.weather[0].icon}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainContainer;
