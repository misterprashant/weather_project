// === Weather Forecasting Script ===

// API setup
const API_KEY = "b0e34aa50313fda4138eb0da151f9544"; // <-- अपनी API key डालें
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// DOM elements
const searchForm = document.querySelector("form");
const searchInput = document.querySelector("input[name='location']");
const locationEl = document.getElementById("location");
const temperatureEl = document.getElementById("temperature");
const conditionEl = document.getElementById("condition");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const hourlyEl = document.getElementById("hourly-forecast");
const dailyEl = document.getElementById("daily-forecast");
const alertsEl = document.getElementById("alerts");

// Fetch weather by city
async function getWeather(city) {
  try {
    const response = await fetch(
      `${BASE_URL}weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayCurrent(data);

    // Get coordinates for forecast
    const { lat, lon } = data.coord;
    getForecast(lat, lon);
  } catch (error) {
    alert(error.message);
  }
}

// Fetch forecast (hourly + daily)
async function getForecast(lat, lon) {
  try {
    const response = await fetch(
      `${BASE_URL}onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    displayHourly(data.hourly);
    displayDaily(data.daily);
    displayAlerts(data.alerts);
  } catch (error) {
    console.error("Forecast error:", error);
  }
}

// Show current weather
function displayCurrent(data) {
  locationEl.textContent = `${data.name}, ${data.sys.country}`;
  temperatureEl.textContent = `${Math.round(data.main.temp)} °C`;
  conditionEl.textContent = data.weather[0].description;
  humidityEl.textContent = `${data.main.humidity}%`;
  windEl.textContent = `${data.wind.speed} m/s`;
}

// Show hourly forecast (next 12 hours)
function displayHourly(hourlyData) {
  hourlyEl.innerHTML = "";
  hourlyData.slice(0, 12).forEach((hour) => {
    const time = new Date(hour.dt * 1000).getHours();
    const temp = Math.round(hour.temp);
    const desc = hour.weather[0].main;
    const div = document.createElement("p");
    div.textContent = `${time}:00 | ${temp}°C | ${desc}`;
    hourlyEl.appendChild(div);
  });
}

// Show 7-day forecast
function displayDaily(dailyData) {
  dailyEl.innerHTML = "";
  dailyData.slice(0, 7).forEach((day) => {
    const date = new Date(day.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
    });
    const tempMax = Math.round(day.temp.max);
    const tempMin = Math.round(day.temp.min);
    const div = document.createElement("p");
    div.textContent = `${date}: ${tempMax}°C / ${tempMin}°C`;
    dailyEl.appendChild(div);
  });
}

// Show weather alerts
function displayAlerts(alerts) {
  alertsEl.innerHTML = "";
  if (!alerts || alerts.length === 0) {
    alertsEl.innerHTML = "<p>No active alerts</p>";
  } else {
    alerts.forEach((alert) => {
      const div = document.createElement("p");
      div.textContent = `${alert.event}: ${alert.description}`;
      alertsEl.appendChild(div);
    });
  }
}

// Handle search
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (city) getWeather(city);
});

// Default city (optional)
getWeather("Hardoi");