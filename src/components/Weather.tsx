import { useEffect, useState } from "react";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";

export default function Weather({ weatherData }: any) {
  const { forecast, weather, icon } = weatherData;
  const dateNow = format(Date.now(), "EEEE d MMMM, H:mm");
  const forecastArray = forecast.list;
  const [dailyForecastArray, setDailyForecastArray] = useState([]);

  function formatDate(dt: number) {
    // Formats the date to: 'Day of the week, the month, day of the month, and time'.
    return format(new Date(dt * 1000), "EEEE", { locale: enGB });
  }

  function formatToDailyForecast() {
    let newArr: any = [];
    let time = "";

    forecastArray.forEach((item: any) => {
      item.dt_txt = item.dt_txt.slice(0, 10);
    });

    forecastArray.forEach((item: any) => {
      if (time === "") {
        time = item.dt_txt;
        newArr.push(item);
      }

      if (time !== item.dt_txt) {
        time = item.dt_txt;
        newArr.push(item);
      }
    });

    setDailyForecastArray(newArr);
  }

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      formatToDailyForecast();
    }

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="Body">
      <div className="weather-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: ".25rem",
          }}
        >
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <h4>{dateNow}</h4>
        </div>
        <div className="weather-body">
          <div className="weather-body-left flex-box">
            <img src={icon} alt="weather icon" style={{ height: "128px" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="weather-temp">{weather.main.temp}&deg;C</div>
              <div style={{ alignSelf: "flex-end" }}>
                {weather.weather[0].main}
              </div>
            </div>
          </div>
          <div className="break-line flex-box"></div>
          <div className="weather-body-right flex-box">
            <div>
              Feels like {weather.main.feels_like}&deg;C,{" "}
              {weather.weather[0].description}
            </div>
            <div>Pressure: {weather.main.pressure}hPHA</div>
            <div>Humidity: {weather.main.humidity}%</div>
            <div>Wind speed: {weather.wind.speed}m/s W</div>
          </div>
        </div>
      </div>

      <div className="forecast-container">
        <h3>Forecast for the upcoming days</h3>
        <div className="forecast-items">
          {dailyForecastArray.map((item: any) => (
            <div key={item.dt} className="forecast-item">
              <div style={{ fontSize: "16px", fontWeight: "700" }}>
                {formatDate(item.dt)}
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt="weather icon"
                title={item.weather[0].description}
              />
              <div style={{ fontSize: "20px", fontWeight: "700" }}>
                {item.main.temp}&deg;C
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
