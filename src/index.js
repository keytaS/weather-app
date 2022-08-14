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
}

function searchCity(city) {
  let apiKey = "c52ac46adf5f0f13abc3cf415215fbaf";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
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
