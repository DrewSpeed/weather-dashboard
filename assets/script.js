searchInputEl = $("#city-search");
searchFormEl = $("#search-form");
storedCities = $("#stored-cities");


searchFormEl.on("submit", function(event) {
    event.preventDefault();
    term = searchInputEl.val().trim();
    console.log(term);
    getCoord(term);
});

getCoord = function(term) {
    var cityApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + term + "&limit=5&appid=d59512c6dea391d77551756401616069";
    console.log(cityApi);
   fetch(cityApi).then(function(response) {
       var selectorData = [];
        response.json().then(function(data){
            console.log(data);
            data.forEach(function(result){
            option = result.name + ', ' + result.state;
            console.log(option);

            selectorData.push({
                display: option,
                lat: result.lat,
                lon: result.lon
            });

                var displayOptions = $('<li class="option">' + option + '</li>');
                storedCities.append(displayOptions);

           
            })
            })
        })
}
  //  })
