var currentWeatherView = $("#current-weather-view");
var citySearch = "La Mesa";
var apiKeyParam = "appid=b825dee8ade9ae135176720980ccb6bf";
var unitsFormat = "units=imperial";

function dumpCurrentWeather() {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=La Mesa&" +
    unitsFormat +
    "&" +
    apiKeyParam;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    currentWeatherView.text(JSON.stringify(response, null, 2));
    var currentWeatherData = {
      cityName: response.name,
      unixTime: response.dt,
      iconUrl: getWeatherIconUrlFromId(response.weather[0].icon),
      temperature: response.main.temp,
      humidityPercent: response.main.humidity,
      windSpeedMetersSec: response.wind.speed,
      location: response.coord,
    };
    console.log(currentWeatherData);
  });
}

function dumpUVdata() {
  var location = { lon: -117.02, lat: 32.77 };
  var queryURL =
    "http://api.openweathermap.org/data/2.5/uvi?lat=" +
    location.lat +
    "&lon=" +
    location.lon +
    "&" +
    apiKeyParam;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    currentWeatherView.text(JSON.stringify(response, null, 2));
    var uvIndex = response.value;
    console.log("uvIndex: " + uvIndex);
  });
}

function dump5DayForecastData() {
  var queryURL =
    "http://api.openweathermap.org/data/2.5/forecast?" +
    "q=" +
    citySearch +
    "&" +
    apiKeyParam;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    currentWeatherView.text(JSON.stringify(response, null, 2));

    var offsetSeconds = response.city.timezone;
    var fiveDayForecastData = [];

    response.list.forEach(function (forecastListItem) {
      var seconds = forecastListItem.dt + offsetSeconds;
      var hours = seconds / 3600;
      var hour = hours % 24;
      if (hour > 12 && hour <= 15) {
        var forecastData = {
          unixTime: forecastListItem.dt,
          temperature: forecastListItem.main.temp,
          humidityPercent: forecastListItem.main.humidity,
          iconUrl: getWeatherIconUrlFromId(forecastListItem.weather[0].icon),
        };
        fiveDayForecastData.push(forecastData);
      }
    });
    console.log(fiveDayForecastData);
  });
}

function getWeatherIconUrlFromId(iconId) {
  return "http://openweathermap.org/img/wn/" + iconId + "@2x.png";
}

// dumpUVdata();
dumpCurrentWeather();
//dump5DayForecastData();
