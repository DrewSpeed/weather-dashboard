searchInputEl = $("#city-search");
searchFormEl = $("#search-form");
storedCities = $("#stored-cities");
cityInfoEl = $("#city-info");
forecastEl = $("#forecast-info");


searchFormEl.on("submit", function(event) {
    event.preventDefault();
    term = searchInputEl.val().trim();
    console.log(term);
    $(".option").remove();  
    getCoord(term);
});


getCoord = function(term) {
    var cityApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + term + "&limit=10&appid=d59512c6dea391d77551756401616069";
    console.log(cityApi);
   fetch(cityApi).then(function(response) {
       
        response.json().then(function(data){
            console.log(data);
            data.forEach(function(result){
            option = result.name + ', ' + result.state;
            var displayOptions = $('<button class="btn btn-secondary mx-auto my-1 option" id="option">' + option + '</button>');
            storedCities.append(displayOptions);
            $(displayOptions).click(function() {getWeather(result);})            
            });
        });
    });
};

getWeather = function(city) {
    // get data for city-info header and append
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + city.lat + "&lon=" + city.lon + "&units=imperial&appid=d59512c6dea391d77551756401616069"
    fetch(weatherApi).then(function(result) {
        return result.json();
    }).then(function(data) {
        unixToday = (data.current.dt)*1000;
            dateToday = new Date(unixToday).toLocaleDateString("en-US");
        var iconToday = '<img src="http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png" />';
        var cityDisplay = $('<h3>' + city.name + ', ' + city.state + ' - ' + dateToday + ' ' + iconToday + '</h3>');
        cityInfoEl.append(cityDisplay);
        //append temperature, wind, humitidy, uvi
        var currentTemp = Math.floor(data.current.temp) + "&deg F";
        var currentWind = data.current.wind_speed + " MPH";
        var currentHumid = data.current.humidity + "%";
        var currentUvi = data.current.uvi
        var todayDisplay = $('<p><strong>Temp: </strong>' + currentTemp + '</p><p><strong>Wind: </strong>' + currentWind + '</p>' + '<p><strong>Humidity: </strong>' + currentHumid + '</p>' + '<p><strong>UV Index: </strong><span id="uv-index">' + currentUvi + '</i></p>' );
        cityInfoEl.append(todayDisplay);
        uviPill = $("#uv-index")       
        // make uvi a badge and change color depending on level
        if (currentUvi <=2) {
            uviPill.addClass("badge badge-success");
        } else if (currentUvi <= 5) { 
            uviPill.addClass("badge badge-warning");
        } else if (currentUvi <= 7) {
            uviPill.addClass("badge badge-secondary");
        } else if (currentUvi <= 10) {
            uviPill.addClass("badge badge-danger");
        } else {
            uviPill.addClass("badge badge-primary");
        }
        cityInfoEl.addClass("border");
        
        for (i=0; i<=4; i++) {
            day = data.daily[i]
            unixDay = (day.dt)*1000;
            dayDate = new Date(unixDay).toLocaleDateString("en-US");
            dayIcon = '<h3><img src="http://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png" /></h3>';
            dayTemp = Math.floor(day.temp.day) + "&deg F";
            dayWind = day.wind_speed + " MPH";
            dayHumid = day.humidity + "%"
            dayDisplay = $('<div class="card p-2 px-3 mx-2 mt-2"> <h5>' + dayDate + '</h5>' + dayIcon + '<p><strong>Temp: </strong>' + dayTemp + '</p><p><strong>Wind: </strong>' + dayWind + '</p><p><strong>Humidity: </strong>' + dayHumid + '</p></div>');
            forecastEl.append(dayDisplay);
        }
    })

    // TODO: call to function that reloads cities stored in localStorage
}

