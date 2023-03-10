import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Weather from './components/Weather';
import About from './components/About';
import Loading from './components/Loading';

const openWeatherMapAPI = {
  apiKey: import.meta.env.VITE_WEATHER_API_KEY,
  url: 'http://api.openweathermap.org/data/2.5/',
  iconUrl: 'http://openweathermap.org/img/wn/'
}

function App() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState<any>();
  const [forecast, setForecast] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [icon, setIcon] = useState('');

  const handleChange = (event: any) => {
    setSearch(event.target.value);
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    if (search === '') {
      alert('Please specify a location.');
      return;
    }

    setLocation(search);

    getData();
  }

  async function getData() {
    setLoading(true);

    await getWeather();

    setSearch('');

    setLoading(false);
  }

  async function getLocation() {
    setLoading(true);

    // await fetch('https://geolocation-db.com/json/a9e48c70-8b22-11ed-8d13-bd165d1291e3')
    // .then(response => {
    //   if (response.ok) {
    //     console.log('Location success')
    //     return response.json();
    //   } else {
    //     return Promise.reject('Location API: error: ' + response.status);
    //   }
    // })
    // .then(result => {
    //   console.log(`Location set: ${result.state}`)
    //   setLocation(result.state);
    // })
    // .catch(error => {
    //   console.log(error)
    //   setLocation('London');
    // });

    setLocation('London');
  }

  async function getWeather() {
    await fetch(`${openWeatherMapAPI.url}weather?q=${location}&units=metric&APPID=${openWeatherMapAPI.apiKey}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else if(response.status === 404) {
        return Promise.reject('error 404');
      } else {
        return Promise.reject('Weather API: error: ' + response.status);
      }
    })
    .then(result => {
      setWeather(result);
    })
    .catch((error) => {
      console.log(`Error: ${error}`)
      // alert(`Error: ${error}, something went wrong`);
    });

    await fetch(`${openWeatherMapAPI.url}forecast?q=${location}&units=metric&APPID=${openWeatherMapAPI.apiKey}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else if(response.status === 404) {
        return Promise.reject('error 404');
      } else {
        return Promise.reject('some other error: ' + response.status);
      }
    })
    .then(result => {
      setForecast(result);
    })
    .catch((error) => {
      console.log(`Error: ${error}`)
    });
  }

  useEffect(() => { // Runs once on application start.
    let ignore = false;
    
    if (!ignore) {
      getLocation();
    };

    return () => { ignore = true; }
  },  []);

  useEffect(() => {
    if (weather) {
      setIcon(`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    }
  }, [weather]);

  useEffect(() => { // Gets weather data based on current location.
    if (location !== '') {
      getData();
    }
  }, [location]);

  const weatherData = { forecast, weather, icon }
  
  return (
    <div className="App">
      <Header handleChange={handleChange} handleSubmit={handleSubmit} search={search} />
      <Routes>
        <Route path='/' element={loading ? <Loading /> : <Weather weatherData={weatherData} />} />
        <Route path='/home' element={loading ? <Loading /> : <Weather weatherData={weatherData} />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </div>
  )
}

export default App;