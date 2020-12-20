var currentWeatherView = $("#current-weather-view");
var search = "La Mesa";
var apiKey = "b825dee8ade9ae135176720980ccb6bf";
var queryURL =
  "https://api.openweathermap.org/data/2.5/weather?q=La Mesa&appid=b825dee8ade9ae135176720980ccb6bf";

$.ajax({
  url: queryURL,
  method: "GET",
}).then(function (response) {
  currentWeatherView.text(JSON.stringify(response, null, 2));
  var currentWeatherData = {
    cityName: response.name,
    date: response.dt,
    icon: response.weather[0].icon,
    humidity: response.main.humidity,
    windSpeed: response.wind.speed,
  };
  console.log(currentWeatherData);
});
