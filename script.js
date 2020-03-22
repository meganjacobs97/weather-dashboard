var searches = []; 

//even listener for dynamically generated previous search buttons 
$(document).on("click",".prevSearchBtn",searchAgain);

renderSearches(); 

$("#searchBtn").on("click",function(event) {
    //stop refresh 
    event.preventDefault(); 

    searchInput = $("#search").val().trim(); 

    saveSearch(searchInput); 
    search(searchInput); 
    //clear search from bar 
    $("#search").val(""); 
}); 

function renderSearches() {
    //clear out empty searches 
    $("#prevSearches").empty(); 
    //grab saved searches 
    searches = JSON.parse(localStorage.getItem("searches")); 
    //go through array and make buttons
    if(searches) {
        for(var i = 0; i < searches.length; i++) {
            //create new row for the button 
            var newRow = $("<div>"); 
            console.log(newRow); 
            newRow.attr("class","row"); 
            
            //create new button 
            var newBtn = $("<button>");
            //add class for styling and listener
            newBtn.attr("class","prevSearchBtn");  
            //add button text 
            newBtn.html(searches[i]); 

            //add button to row
            newRow.append(newBtn); 
            //add row to proper place
            $("#prevSearches").prepend(newRow); 
        }
        //display most recent search 
        search(searches[searches.length - 1]); 
    }
    
}

function saveSearch(searchItem) {
    //initialize array is neccessary 
    if(!searches) {
        searches = []; 
    }
    //add search to array 
    searches.push(searchItem); 

    //save array to local storage 
    localStorage.setItem("searches",JSON.stringify(searches)); 

    //rerender searches 
    renderSearches(); 
}

function search(searchItem) {
    

    var apiKey = "6f539c63cd3802e2eb82a7cccf50e151"; 
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchItem + "&appid=" + apiKey;
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchItem + "&appid=" + apiKey;


    //call for weather 
    $.ajax({
        url: weatherURL, 
        method: "GET"
    }).then(function(response) {
        console.log(response); 

        //uv index 
        var lat = response.coord.lat; 
        var lon = response.coord.lon; 
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon; 
        $.ajax({
            url: uvURL, 
            method: "GET"
        }).then(function(uvResponse) {
            console.log(uvResponse); 

            //city name
            var cityName = response.name; 
            cityName = cityName.substring(0,1).toUpperCase() + cityName.substring(1); 
            //weather 
            var weather = response.weather[0].description; 

            //the date
            var date = response.dt; 

            date = new Date(date*1000);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            
            date = "(" + month + "/" + day + "/" + year + ")"; 
            //the temperature 
            var temp = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(2);
            //the humidity
            var humidity = response.main.humidity;
            //the wind speed
            var windSpeed = response.wind.speed; 
            //the UV index
            var uv = uvResponse.value; 

            var uvButton = $("<button>"); 
            uvButton.attr("id","uvButton"); 
            uvButton.text(uv); 
            //do checks for for class that will determind button color 
    
            if(parseFloat(uv) <= 2) {
                uvButton.attr("class","greenBtn");
            }
            else if(parseFloat(uv) <= 5) {
                uvButton.attr("class","yellowBtn");
            }
            else if(parseFloat(uv) <= 7) {
                uvButton.attr("class","orangeBtn"); 
            }
            else {
                uvButton.attr("class","redBtn")
            }



            //create elements to be added 
            $("#cityDiv").html("<h3>" + cityName + " " + date + "</h3>"); 
            $("#weatherDiv").html("<p>Weather: " + weather + "</p>"); 
            $("#tempDiv").html("<p>Temperature: " + temp + 	"&#176;" + "F</p>");  
            $("#humidityDiv").html("<p>Humidity: " +  humidity + "%</p>"); 
            $("#windSpeedDiv").html("<p>Wind Speed: " + windSpeed + "MPH</p>"); 
            $("#uvDivCol1").html("<p>UV: "); 
            $("#uvDivCol2").empty(); 
            $("#uvDivCol2").append(uvButton); 
            
           

            
                
        }); 



    }); 

    //call for five day forecast 
    $.ajax({
        url: fiveDayURL, 
        method: "GET"
    }).then(function(response) {
        console.log(response); 
        //1
            //date
            var date = response.list[8].dt; 

            date = new Date(date*1000);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            
            date = month + "/" + day + "/" + year; 
            //weather
            var weather = response.list[8].weather[0].main; 
            //temp
            var temp = ((response.list[8].main.temp - 273.15) * 1.80 + 32).toFixed(2);
            //humidity 
            var humidity = response.list[8].main.humidity; 

            $("#day1Date").html("<h3>" + date + "</h3>"); 
            $("#day1Weather").html("<p>Weather: " + weather + "</p>"); 
            $("#day1Temp").html("<p>Temperature: " + temp + "&#176;" + "F</p>"); 
            $("#day1Humidity").html("<p>Humidity: " + humidity + "%</p>"); 
        //2
            //date
            date = response.list[16].dt; 

            date = new Date(date*1000);

            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            
            date = month + "/" + day + "/" + year; 
            //weather
            var weather = response.list[16].weather[0].main; 
            //temp
            var temp = ((response.list[16].main.temp - 273.15) * 1.80 + 32).toFixed(2);
            //humidity 
            var humidity = response.list[16].main.humidity; 

            $("#day2Date").html("<h3>" + date + "</h3>"); 
            $("#day2Weather").html("<p>Weather: " + weather + "</p>"); 
            $("#day2Temp").html("<p>Temperature: " + temp + "&#176;" + "F</p>"); 
            $("#day2Humidity").html("<p>Humidity: " + humidity + "%</p>"); 
        //3
            //date
            date = response.list[24].dt; 

            date = new Date(date*1000);

            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            
            date = month + "/" + day + "/" + year; 
            //weather
            var weather = response.list[24].weather[0].main; 
            //temp
            var temp = ((response.list[24].main.temp - 273.15) * 1.80 + 32).toFixed(2);
            //humidity 
            var humidity = response.list[24].main.humidity; 

            $("#day3Date").html("<h3>" + date + "</h3>"); 
            $("#day3Weather").html("<p>Weather: " + weather + "</p>"); 
            $("#day3Temp").html("<p>Temperature: " + temp + "&#176;" + "F</p>"); 
            $("#day3Humidity").html("<p>Humidity: " + humidity + "%</p>"); 
        //4
            //date
            date = response.list[32].dt; 

            date = new Date(date*1000);

            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            
            date = month + "/" + day + "/" + year; 
            //weather
            var weather = response.list[32].weather[0].main; 
            //temp
            var temp = ((response.list[32].main.temp - 273.15) * 1.80 + 32).toFixed(2);
            //humidity 
            var humidity = response.list[32].main.humidity; 

            $("#day4Date").html("<h3>" + date + "</h3>"); 
            $("#day4Weather").html("<p>Weather: " + weather + "</p>"); 
            $("#day4Temp").html("<p>Temperature: " + temp + "&#176;" + "F</p>"); 
            $("#day4Humidity").html("<p>Humidity: " + humidity + "%</p>");  
        //5
            //date
            date = response.list[39].dt; 

            date = new Date(date*1000);

            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            
            date = month + "/" + day + "/" + year; 
            //weather
            var weather = response.list[39].weather[0].main; 
            //temp
            var temp = ((response.list[39].main.temp - 273.15) * 1.80 + 32).toFixed(2);
            //humidity 
            var humidity = response.list[39].main.humidity; 

            $("#day5Date").html("<h3>" + date + "</h3>"); 
            $("#day5Weather").html("<p>Weather: " + weather + "</p>"); 
            $("#day5Temp").html("<p>Temperature: " + temp + "&#176;" + "F</p>"); 
            $("#day5Humidity").html("<p>Humidity: " + humidity + "%</p>"); 

    }); 
}

function searchAgain() {
    var searchItem = $(this).text(); 
    search(searchItem); 
}