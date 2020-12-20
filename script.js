var currentWeatherView = $("#current-weather-view");
var search = "La Mesa";
var apiKey = "b825dee8ade9ae135176720980ccb6bf";

function dumpCurrentWeather() {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=La Mesa&appid=b825dee8ade9ae135176720980ccb6bf";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    currentWeatherView.text(JSON.stringify(response, null, 2));
    var currentWeatherData = {
      cityName: response.name,
      unixTime: response.dt,
      iconTd: response.weather[0].icon,
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
    "&appid=b825dee8ade9ae135176720980ccb6bf";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    currentWeatherView.text(JSON.stringify(response, null, 2));
    var uvIndex = response.value;
    console.log("uvIndex: " + uvIndex);
  });
}

dumpUVdata();
//dumpCurrentWeather();
