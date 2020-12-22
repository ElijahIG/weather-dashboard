var currentWeatherView = $("#current-weather-view");
var citySearch = "La Mesa";
var apiKeyParam = "appid=b825dee8ade9ae135176720980ccb6bf";
var unitsFormat = "units=imperial";

function fetchCurrentWeather(city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&" +
    unitsFormat +
    "&" +
    apiKeyParam;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var currentWeatherData = {
      cityName: response.name,
      unixTime: response.dt,
      iconUrl: getWeatherIconUrlFromId(response.weather[0].icon),
      temperature: response.main.temp,
      humidityPercent: response.main.humidity,
      windMPH: response.wind.speed,
      location: response.coord,
    };
    fetchUVData();
    fetch5DayForecast(currentWeatherData.cityName);
    renderCurrentWeatherCard(currentWeatherData);
  });
}

function fetchUVData() {
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
    renderUVBadge(response.value);
  });
}

function fetch5DayForecast(citySearch) {
  var queryURL =
    "http://api.openweathermap.org/data/2.5/forecast?" +
    "q=" +
    citySearch +
    "&" +
    unitsFormat +
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
    render5DayForecast(fiveDayForecastData);
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

function renderCurrentWeatherCard(weatherData) {
  console.log(weatherData);
  var title = $("<h2 class='card-title h3'>").text(weatherData.cityName);
  var weatherIcon = renderWeatherIcon(weatherData.iconUrl);
  title.append(weatherIcon);

  var subtitle = $("<h3 class='card-subtitle mb-3 text-muted'>").text(
    renderDateFromUnixSeconds(weatherData.unixTime)
  );
  var tempCardText = $("<p class='card-text'>").text(
    "Temperature: " + weatherData.temperature + " °F"
  );
  var humidityCardText = $("<p class='card-text'>").text(
    "Humidity: " + weatherData.humidityPercent + "%"
  );
  var windCardText = $("<p class='card-text'>").text(
    "Wind Speed: " + weatherData.windMPH + " MPH"
  );
  var uvIndexCardText = $("<p  id='uv-index' class='card-text'>").text(
    "UV Index: "
  );

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

function renderWeatherIcon(src) {
  return $("<img>").attr({
    class: "weather-icon",
    src: src,
  });
}

function renderDateFromUnixSeconds(unixTime) {
  return moment.unix(unixTime).format("M/D/Y");
}

function renderUVBadge(uvIndex) {
  var severity = uvSeverity(uvIndex);
  var badge = $("<span class='uv-index badge'>")
    .addClass(severity)
    .text(uvIndex);
  $("#uv-index".append(badge));
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

function render5DayForecast(forecastData) {
  var sectionHeading = $("<h2 class='h4'>5-Day Forecast:</h2>");

  var row = $("<div class='row'>");

  forecastData.forEach(function (forecast) {
    var forecastColumn = renderForecastCardColumn(forecast);
    row.append(forecastColumn);
  });

  $("#forecast-section").empty().append(sectionHeading, row);
}

function renderForecastCardColumn(forecast) {
  var title = $("<h5 class='card-title'>").text(
    renderDateFromUnixSeconds(forecast.unixTime)
  );
  var weatherIcon = renderWeatherIcon(forecast.iconUrl);
  var cardText = $("<p class='card-text'>").append(
    "Temperature: " + forecast.temperature + " °F",
    "<br>",
    "Humidity: " + forecast.humidityPercent + "%"
  );
  var body = $("<div class='card-body'>").append(title, weatherIcon, cardText);
  var card = $("<div class='card text-white bg-primary forecast mt-4'>").append(
    body
  );
  return $("<div class='col-xl'>").append(card);
}

var searchHistory = [
  "La Mesa",
  "South Lake Tahoe",
  "Bishop",
  "Las Vegas",
  "Cedar City",
];
renderHistory(searchHistory);

$("#search-form").on("submit", function (event) {
  event.preventDefault();

  var city = $("#city-input").val().trim();
  $("#city-input").val("");
  fetchCurrentWeather(city);
});
