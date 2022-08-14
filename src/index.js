let currentDate = new Date();
let fullweek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let currentWeekday = fullweek[currentDate.getDay()];
let currentHours = currentDate.getHours();
let currentMinutes = currentDate.getMinutes();
if (currentHours < 10) {
  currentHours = `0${currentHours}`;
}
if (currentMinutes < 10) {
  currentMinutes = `0${currentMinutes}`;
}
let now = document.querySelector("#date");
now.innerHTML = `${currentWeekday} ${currentHours}:${currentMinutes}`;

let initialCelcius = null;
let temperatureElement = document.querySelector("#temperature");

function convertToFahrenheit(event) {
  event.preventDefault();
  let fahrenheitTemperature = Math.round((initialCelcius * 9) / 5 + 32);
  temperatureElement.innerHTML = fahrenheitTemperature;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function convertToCelsius(event) {
  event.preventDefault();
  temperatureElement.innerHTML = initialCelcius;
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

function displayWeatherCondition(response) {
  document.querySelector("#city").innerHTML =
    response.data.name + ` (` + response.data.sys.country + `)`;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#visibility").innerHTML = Math.round(
    (response.data.visibility * 1.609) / 1000
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  initialCelcius = Math.round(response.data.main.temp);
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}

function error(err) {
  let searchCity = document.querySelector("#search-input").value;
  if (err) {
    alert(`Can't find this place 🥲
Check the spelling of "${
      searchCity.charAt(0).toUpperCase() + searchCity.slice(1)
    }" and try once again!`);
  }
}
function searchCity(city) {
  let apiKey = "c52ac46adf5f0f13abc3cf415215fbaf";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition).catch(error);
}

function submitButton(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "c52ac46adf5f0f13abc3cf415215fbaf";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", submitButton);

let currentLocationButton = document.querySelector("#currentButton");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("Kyiv");

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day + 1];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2.5">
      <div class="card">
        <div class="card-header">${formatDay(forecastDay.dt)}</div>
        <div class="card-body">
          <div class="forecastDegrees">
          <p>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="60"
        />
        </p>
        <footer class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </footer>
      </div>
        </div>
      </div></div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "c52ac46adf5f0f13abc3cf415215fbaf";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
