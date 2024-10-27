let climateTracker = {
  apiKey: "29bd84e33289f196e453fde9559b7bbd",
  
  getWeatherData: function (location) {
      fetch(
          "https://api.openweathermap.org/data/2.5/forecast?q=" 
          + location 
          + "&units=metric&appid=" 
          + this.apiKey
      )
      .then((response) => {
          if (!response.ok) {
              alert("No weather data found.");
              throw new Error("No weather data found.");
          }
          return response.json();
      })
      .then((data) => this.renderWeatherData(data));
  },
  
  renderWeatherData: function (weatherData) {
      const { name: cityName } = weatherData.city;
      const { icon, description } = weatherData.list[0].weather[0];
      const { temp, feels_like, humidity, temp_min, temp_max } = weatherData.list[0].main;
      const { speed: windSpeed } = weatherData.list[0].wind;
      const lastUpdated = weatherData.list[0].dt_txt;

      document.querySelector(".city-name").innerText = "Weather in " + cityName;
      document.querySelector(".weather-icon").src =
          "https://openweathermap.org/img/wn/" + icon + ".png";
      document.querySelector(".weather-description").innerText = description;
      document.querySelector(".last-updated").innerText = "Last updated: " + lastUpdated;

      const convertTemperature = (temp, unit) => {
          if (unit === "F") {
              return ((temp * 9 / 5) + 32).toFixed(2);
          } else if (unit === "K") {
              return (temp + 273.15).toFixed(2);
          } else {
              return temp.toFixed(2);
          }
      };

      const selectedUnit = currentUnit;

      document.querySelector(".city-name").innerText = "Weather in " + cityName;
      document.querySelector(".weather-icon").src =
          "https://openweathermap.org/img/wn/" + icon + ".png";
      document.querySelector(".weather-description").innerText = description;
      document.querySelector(".last-updated").innerText = "Last updated: " + lastUpdated;

      document.querySelector(".temperature").innerText = convertTemperature(temp, selectedUnit) + " °" + selectedUnit;
      document.querySelector(".feels-like").innerText = "Feels like: " + convertTemperature(feels_like, selectedUnit) + " °" + selectedUnit;
      document.querySelector(".average-temperature").innerText = "Avg Temp: " + convertTemperature((temp_min + temp_max) / 2, selectedUnit) + " °" + selectedUnit;
      document.querySelector(".min-temperature").innerText = "Min Temp: " + convertTemperature(temp_min, selectedUnit) + " °" + selectedUnit;
      document.querySelector(".max-temperature").innerText = "Max Temp: " + convertTemperature(temp_max, selectedUnit) + " °" + selectedUnit;

      document.querySelector(".humidity-level").innerText = "Humidity: " + humidity + "%";
      document.querySelector(".wind-speed").innerText = "Wind speed: " + windSpeed + " km/h";

      document.querySelector(".weather-display").classList.remove("loading");

      for (let i = 1; i <= 5; i++) {
          const forecast = weatherData.list[i * 6]; // e.g., list[6], list[12], etc.
          document.querySelector(`.forecast-icon${i}`).src =
              "https://openweathermap.org/img/wn/" + forecast.weather[0].icon + ".png";
          document.querySelector(`.forecast-temp${i}`).innerText = convertTemperature(forecast.main.temp, selectedUnit) + " °" + selectedUnit;
          document.querySelector(`.forecast-dt${i}`).innerText = forecast.dt_txt;
      }
  },

  searchWeather: function () {
      this.getWeatherData(document.querySelector(".search-input").value);
  },
};

document.querySelector(".search-button").addEventListener("click", function () {
  climateTracker.searchWeather();
});

document.querySelector(".search-input").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
      climateTracker.searchWeather();
  }
});

let currentUnit = "C";
document.querySelector("select").addEventListener("change", function (event) {
  currentUnit = event.target.value;
  climateTracker.getWeatherData(document.querySelector(".city-name").innerText.split("Weather in ")[1] || "Bangalore");
});

climateTracker.getWeatherData("Bangalore");
