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

function renderHistory(searchHistory) {
  var newListGroup = $("<div>");
  searchHistory.forEach(function (city) {
    var button = $("<button>")
      .attr({
        type: "button",
        class: "list-group-item list-group-item-action",
      })
      .text(city);
    newListGroup.append(button);
  });

  $(".list-group").empty().append(newListGroup);
}

function renderCurrentWeatherCard() {
  var title = $("<h2 class='card-title h3'>").text("La Mesa");
  var weatherIcon = $("<img>").attr({
    class: "weather-icon",
    src: "http://openweathermap.org/img/wn/01n@2x.png",
  });
  title.append(weatherIcon);

  var subtitle = $("<h3 class='card-subtitle mb-3 text-muted'>").text(
    "12/20/2020"
  );
  var tempCardText = $("<p class='card-text'>").text("Temperature: 65 °F");
  var humidityCardText = $("<p class='card-text'>").text("Humidity: 23%");
  var windCardText = $("<p class='card-text'>").text("Wind Speed: 1 MPH");
  var uvIndexCardText = $("<p class='card-text'>")
    .text("UV Index: ")
    .append(renderUVBadge(3.0));
  var body = $("<div class='card-body'>").append(
    title,
    subtitle,
    tempCardText,
    humidityCardText,
    windCardText,
    uvIndexCardText
  );
  var card = $("<div class='card'>").append(body);
  $("#current-weather").empty().append(card);
}

function renderUVBadge(uvIndex) {
  var severity = uvSeverity(uvIndex);
  return $("<span class='uv-index badge'>").addClass(severity).text(uvIndex);
}

function uvSeverity(uvIndex) {
  if (uvIndex < 3) {
    return "low";
  }
  if (uvIndex < 6) {
    return "moderate";
  }
  if (uvIndex < 8) {
    return "high";
  }
  if (uvIndex < 11) {
    return "very-high";
  }
  return "extreme";
}

var searchHistory = [
  "La Mesa",
  "South Lake Tahoe",
  "Bishop",
  "Las Vegas",
  "Cedar City",
];
renderHistory(searchHistory);
renderCurrentWeatherCard();
// dumpUVdata();
//dumpCurrentWeather();
//dump5DayForecastData();
