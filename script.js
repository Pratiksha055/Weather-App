const apiKey = "30f73c7c9dc7ab69923ee4a8a7d9d372"; // Replace with your own OpenWeatherMap API key

async function getWeather(cityName = null) {
  const cityInput = document.getElementById("cityInput");
  const city = cityName || encodeURIComponent(cityInput.value.trim());
  const resultDiv = document.getElementById("weatherResult");

  if (city === "") {
    resultDiv.innerHTML = `<p style="color: red;">Please enter a city name.</p>`;
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
      return;
    }

    displayWeather(data);
  } catch (error) {
    resultDiv.innerHTML = `<p style="color: red;">Something went wrong. Please try again later.</p>`;
  }
}

function getWeatherByCity(cityName) {
  getWeather(cityName);
}

function displayWeather(data) {
  const resultDiv = document.getElementById("weatherResult");
  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  resultDiv.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <div class="weather-details">${currentTime}<br>${data.weather[0].description}</div>
    <div class="temp-large">
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon" />
      ${Math.round(data.main.temp)}&deg;F
    </div>
    <div class="extra-info">
      <div>Humidity: ${data.main.humidity}%</div>
      <div>Wind: ${Math.round(data.wind.speed)} mph</div>
    </div>
  `;
}

document.getElementById("cityInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

        try {
          const response = await fetch(url);
          const data = await response.json();

          if (data.cod !== 200) {
            document.getElementById("weatherResult").innerHTML = `<p style="color: red;">${data.message}</p>`;
            return;
          }
          displayWeather(data);
        } catch (err) {
          document.getElementById("weatherResult").innerHTML = `<p style="color: red;">Failed to load weather for your location.</p>`;
        }
      },
      (error) => {
        console.warn("Geolocation blocked or failed:", error);
      }
    );
  } else {
    console.warn("Geolocation is not supported in this browser.");
  }
});
