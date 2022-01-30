searchInputEl = $("#city-search");
searchFormEl = $("#search-form");
storedCitiesEl = $("#stored-cities");
cityInfoEl = $("#city-info");
forecastEl = $("#forecast-info");
dailyHeaderEl = $("#daily-header");


searchFormEl.on("submit", function(event) {
    event.preventDefault();
    term = searchInputEl.val().trim();
    $(".option").remove();  
    dailyHeaderEl.children().remove();
    getCoord(term);
});


getCoord = function(term) {
    cityInfoEl.children().remove();
    forecastEl.children().remove();


    var cityApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + term + "&limit=7&appid=d59512c6dea391d77551756401616069";
    console.log(cityApi);
   fetch(cityApi).then(function(response) {
       
        response.json().then(function(data){
            console.log(data);
            getWeather(data);    
            })
   
        });
    };

getWeather = function(data) {
    data.forEach(function(result){
        option = result.name + ', ' + result.state;
        var displayOptions = $('<button class="btn btn-secondary mx-auto my-1 option" id="option">' + option + '</button>');
        storedCitiesEl.append(displayOptions);

        $(displayOptions).click(async function() {
            cityInfoEl.children().remove();
            dailyHeaderEl.children().remove();
            forecastEl.children().remove();
            storeKey(result);
            setLocalStorage(result);
            appendWeather(result);
            getLocalStorage();
        })
        
        })
    }
    // get data for city-info header and append
    // storeKey(city);
 appendWeather = function(city) {
    cityName = "http://api.openweathermap.org/geo/1.0/reverse?lat=" + city.lat +"&lon=" + city.lon + "&limit=1&appid=d59512c6dea391d77551756401616069";
    nameInfo = fetch(cityName).then(function(response) {
        return response.json();
    }).then (function(data) {
            return data[0];
    })

    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + city.lat + "&lon=" + city.lon + "&units=imperial&appid=d59512c6dea391d77551756401616069"
    fetch(weatherApi).then(function(result) {
        return result.json();
        
        
    }).then(async function(data) {
        unixToday = (data.current.dt)*1000;
        nameInfo = await nameInfo;
            dateToday = new Date(unixToday).toLocaleDateString("en-US");
        var iconToday = '<img src="http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png" />';
        var cityDisplay = $('<h3>' + nameInfo.name + ' - ' + dateToday + ' ' + iconToday + '</h3>');
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
        
        dailyHeader = $('<h3 class="pt-3">5-Day Forecast:</h3>');
        dailyHeaderEl.append(dailyHeader);
        for (i=0; i<=4; i++) {
            
            day = data.daily[i];
            unixDay = (day.dt)*1000;
            dayDate = new Date(unixDay).toLocaleDateString("en-US");
            dayIcon = '<h3><img src="http://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png" /></h3>';
            dayTemp = Math.floor(day.temp.day) + "&deg F";
            dayWind = day.wind_speed + " MPH";
            dayHumid = day.humidity + "%"
            dayDisplay = $('<div class="card p-2 px-3 mx-2 mt-2"> <h5>' + dayDate + '</h5>' + dayIcon + '<p><strong>Temp: </strong>' + dayTemp + '</p><p><strong>Wind: </strong>' + dayWind + '</p><p><strong>Humidity: </strong>' + dayHumid + '</p></div>');
            forecastEl.append(dayDisplay);
        }
       // setLocalStorage(data);
    })
}


getLocalStorage = function(){
    $(".option").remove();  
        getKey = JSON.parse(localStorage.getItem("pastSearches"));
       console.log(getKey);
       storedCities = []
       for (i=0; i<=6; i++){
        city = localStorage.getItem(getKey[i]);
        city = JSON.parse(city);
        if (city) {
        storedCities.push(city);
        }
            }
            console.log(storedCities);
            getWeather(storedCities);
        }


storeKey = function(city) {
    pastSearches= [];
    cityAdd = city.name + ' , ' + city.state;
    if(localStorage["pastSearches"]) {
        pastSearches = JSON.parse(localStorage["pastSearches"]);
    }
    if(pastSearches.indexOf(cityAdd) == -1) {
        pastSearches.unshift(cityAdd);
        if(pastSearches.length>5) {
            pastSearches.pop();
        }
        localStorage["pastSearches"] = JSON.stringify(pastSearches);
    }
}


setLocalStorage = function(cityData) {
    keyId = localStorage.getItem("pastSearches");
    keyId = JSON.parse(keyId);
    cityData = JSON.stringify(cityData);
        localStorage.setItem(keyId[0], cityData);
        return;
}

getLocalStorage();

