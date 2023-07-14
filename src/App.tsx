import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Weather from "./components/Weather";
import About from "./components/About";
import Loading from "./components/Loading";
import "./App.css";

const openWeatherMapAPI = {
  apiKey: import.meta.env.VITE_WEATHER_API_KEY,
  url: "https://api.openweathermap.org/data/2.5/",
  iconUrl: "https://openweathermap.org/img/wn/",
};

function App() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState<any>();
  const [forecast, setForecast] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [icon, setIcon] = useState("");

  const handleChange = (event: any) => {
    setSearch(event.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (search === "") {
      alert("Please specify a location.");
      return;
    }

    setLocation(search);

    getData();
  };

  async function getData() {
    setLoading(true);

    await getWeather();

    setSearch("");

    setLoading(false);
  }

  async function getLocation() {
    setLoading(true);
    setLocation("London");
  }

  async function getWeather() {
    await fetch(
      `${openWeatherMapAPI.url}weather?q=${location}&units=metric&APPID=${openWeatherMapAPI.apiKey}`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          return Promise.reject("error 404");
        } else {
          return Promise.reject("Weather API: error: " + response.status);
        }
      })
      .then((result) => {
        setWeather(result);
        console.log(result);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
        // alert(`Error: ${error}, something went wrong`);
      });

    await fetch(
      `${openWeatherMapAPI.url}forecast?q=${location}&units=metric&APPID=${openWeatherMapAPI.apiKey}`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          return Promise.reject("error 404");
        } else {
          return Promise.reject("some other error: " + response.status);
        }
      })
      .then((result) => {
        setForecast(result);
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  }

  useEffect(() => {
    // Runs once on application start.
    let ignore = false;

    if (!ignore) {
      getLocation();
    }

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (weather) {
      setIcon(
        `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
      );
    }
  }, [weather]);

  useEffect(() => {
    // Gets weather data based on current location.
    if (location !== "") {
      getData();
    }
  }, [location]);

  const weatherData = { forecast, weather, icon };

  return (
    <div className="app">
      <Header
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        search={search}
      />
      <Routes>
        <Route
          path="/"
          element={
            loading ? <Loading /> : <Weather weatherData={weatherData} />
          }
        />
        <Route
          path="/home"
          element={
            loading ? <Loading /> : <Weather weatherData={weatherData} />
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
