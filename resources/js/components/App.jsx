import { useState, useEffect } from 'react'
import React from 'react'
import axios from 'axios'
import SearchBar from './SearchBar'
import WeatherCard from './WeatherCard'
import Forecast from './Forecast'
import '../../css/App.css'
import logo from '../../../public/logo.svg'

const API_BASE_URL = 'http://192.168.17.37:8080'; // Замените на ваш реальный базовый URL

// получаем данные и убираем повторяющиеся дни
const processForecastData = (list) => {
  const dailyData = {};

  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0]; // YYYY-MM-DD
    const temp = item.main.temp;

    if (!dailyData[date]) {
      dailyData[date] = {
        min: temp,
        max: temp,
        icon: item.weather[0].icon,
        description: item.weather[0].description
      };
    } else {
      dailyData[date].min = Math.min(dailyData[date].min, temp);
      dailyData[date].max = Math.max(dailyData[date].max, temp);
    }
  });

  return Object.entries(dailyData).map(([date, data]) => ({
    date,
    ...data
  }));
};

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  const fetchWeather = async (city) => {
    try {
      const response = await axios.get('/api/weather', {
        params: { city }
      });
      console.log(response.data);
      setWeatherData(response.data.current);
      setForecastData(response.data.forecast);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const {latitude, longitude} = position.coords;
        try {
          const response = await axios.get('/api/weather', {
            params: { 
              lat: latitude, 
              lon: longitude 
            }
          });
          setWeatherData(response.data.current);
          setForecastData(response.data.forecast);
        } catch(error) {
          console.error("Ошибка при получении погоды:", error);
        }
      }
    );
  }, []);



  return (
    <>
      <header>
        <div className="container">
          <nav>
            <div className="logo">
              <img className='nav__logo' src={logo} alt="" />
              <p className='logo__text'>Погода</p>
            </div>
            <div className="search">
              <SearchBar onSearch={fetchWeather} />
            </div>
          </nav>
        </div>
      </header>
      <main>
        <section className="current__weather">
          <div className="container">
            <WeatherCard weatherData={weatherData} />
          </div>
        </section>
        <section className="forecast">
          <div className="container">
            <Forecast forecastData={forecastData} />
          </div>
        </section>
      </main>
    </>
  );
}

// function App() {
//   return (
//     <div>
//       <h1>Hello World</h1>
//     </div>
//   );
// }

export default App

