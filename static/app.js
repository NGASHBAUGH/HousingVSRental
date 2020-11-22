// Set the category to zipcode 
var areaCategory = "Z"
// Create a count variable  to count the number of times the user presses the search button.
var count = 0

// Set the indicators for the API call for Zillow
var indicatorCodePrice = 'ZHVISF'
var indicatorCodeRental = "ZRISFRR.json"

// When the user selects the search button this is the first function called
function handleSubmit(){
    // prevent the page from reloading then grab the value the user input and empty the input value
    d3.event.preventDefault();
    var userInput = d3.select('#input').node().value;
    d3.select('#input').node().value = "";
    // kick off other function using the user input
    apiCall(userInput)
    apiCall(userInput);
    getDemoInfo(userInput)
    getHomes(userInput)
}

// Function to search the 2018 cencus data we have stored in SQL a database

// API call to the housing data and then creating a bar graph
function apiCall(input) {

    // WHY IS THIS HERE???
    d3.json(`/sqlsearch/${input}`).then(function(data){
        var info = data
    });

    // API Key was free and the same for all users 
    var url = `https://www.quandl.com/api/v3/datasets/ZILLOW/${areaCategory}${input}_${indicatorCodePrice}?start_date=2017-01-01&api_key=sPG_jsHhtuegYcT7TNWz`
    // API call to grab the housing data then creating the graph
    d3.json(url).then(function (pulled) {
        // create lists and push the data to the list
        var xprice = []
        var ydate = []
        pulled.dataset.data.forEach(i => { ydate.push(i[0]) });
        pulled.dataset.data.forEach(i => { xprice.push(i[1]) });
        // Write the name of the API pull above the bar graph
        var barT = d3.select('#barText').html("")
        barT.append("h4").attr("class","well").text(pulled.dataset.name)
        // create a trace for the houing graph
        var trace = {
            x : ydate,
            y : xprice, 
            type : 'bar'
        };
        // group the data 
        var barData = [trace];

        // Create the layout, adding in range to make easier to compare 
        var layout = {
            title : "House Price",
            yaxis : {
                title : "Price of House" ,
                range : [ d3.min(xprice) -d3.min(xprice) *.01 , d3.max(xprice) +d3.min(xprice) *.01]
            },
            xaxis : {
                title : "Years"
            }
        };
        // Plot the graph 
        Plotly.newPlot('bar', barData , layout );
        // Call the next function using the area category  and the user input
        rentalAPI(areaCategory , input)
    })

}
// API call to the rental data and then creating a bar graph
function rentalAPI(areaCategory , input){
    // API Key was free and the same for all users 
    var redline = d3.select("#Redline").html("").append("h4").attr("class","well").text('The red line represents the median household income divided by 12(for months) and then divided by 3, because a good rule of thumb is to not spend more than one third of your monthly income on rent')
    var url = `https://www.quandl.com/api/v3/datasets/ZILLOW/${areaCategory}${input}_${indicatorCodeRental}?start_date=2017-01-01&api_key=sPG_jsHhtuegYcT7TNWz`
    // API call to grab the rental data then creating the graph
    d3.json(url).then(function (pulled) {
        // create lists and push the data to the list
        var xprice = []
        var ydate = []
        pulled.dataset.data.forEach(i => { ydate.push(i[0]) });
        pulled.dataset.data.forEach(i => { xprice.push(i[1]) });
        // Write the name of the API pull above the bar graph
        var barT = d3.select('#gaugeText').html("")
        barT.append("h4").attr("class","well").text(pulled.dataset.name)
        // create a trace for the houing graph
        var trace = {
            x : ydate,
            y : xprice, 
            type : 'bar'
        };
        // group the data 
        var barData = [trace];

            // Create a line on the graph to show the monthly amount people should be paying for rent( pay / 3) 
            // Use the SQL search to find the median household income
        d3.json(`/sqlsearch/${input}`).then(function(data){

            var info1 = data
            // divide the income by 12 for months then by 3, a good rule of thumb is dont spend more than 1/3 of your income fo housing
            var medIncome = (info1.median_household_income[0]/12)/3
            // create the line 
            var hline = {
                type : "line", 
                xref : 'paper', 
                x0 : 0, 
                x1 : 1, 
                y0 : medIncome, 
                y1 : medIncome,
                line : {
                    color: 'rgb(255, 0, 0)',
                    width: 4,
                    dash:'dot'
                }
            } 
        // Find the min and the max values, we want to include the line 
        var minRent = d3.min(xprice)
        if (medIncome < minRent ){
            var minRentRange = medIncome - (medIncome *.01)
        }
        if (medIncome> minRent){
            var minRentRange = minRent  -(minRent * .01)
        }
        var maxRent = d3.max(xprice)
        if (medIncome > maxRent ){
            var maxRentRange = medIncome + (medIncome *.01)
        }
        if (medIncome < maxRent){
            var maxRentRange = maxRent + (maxRent * .01)
        }
        // Create the layout, adding in range to make easier to compare 
        var layout = {
            shapes : [hline], 
            title : "Rental Index",
            yaxis : {
                title : "Rental Price" ,
                range : [ minRentRange, maxRentRange]
            },
            xaxis : {
                title : "Years"
            }
        };
        // plot the graph 
        Plotly.newPlot('gauge', barData , layout );
    })
    })
}


// create the map 
let myMap 

// Map function  using longitude and latitude as variables 
function createMap(latitude , longitude){
    // add 1 to counter for if statement. If statement deletes old searched map and generates id for new map to be linked to
    count = 1 + count 
    if (count > 1 ){
        map.remove()
        document.getElementById('contianerMap').innerHTML ="<div id='map' style='height: 400px;'    ></div>" ;
    }
    // Create streetmap layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    tileSize: 512,
    maxZoom: 50,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: "pk.eyJ1Ijoiam9yZGFudSIsImEiOiJja2dyYjN0MGowMHZ5MnVuenR0ZG8weHl2In0.wlCzpVVa_PgxzWRK2s2rRA"

    // accessToken: API_KEY
    });
    // Creates map for layers to be placed on. 
    var myMap = L.map("map", {
    center: [
        latitude , longitude

        ],
    zoom: 12
    });
    // Add street layer to map 
    streetmap.addTo(myMap)
    
}

// this is linked to the submit button on the page and activates the search 
d3.select('#Submit').on('click' , handleSubmit);
// Activates the category function and saves what is chosen by the user
d3.selectAll('#main').on('change' , category)


// function to build Market Highlights
function getDemoInfo(input){
    // grab 2018 cencus data
    d3.json(`/sqlsearch/${input}`).then(function(data){
        var info2 = data
        // grab HTML where map is to be placed 
        var marketInfo = d3.select("#sample-metadata");
        // clear HTML that is there 
        marketInfo.html("");
        // Fill with highlights from SQL 2018 cencus data 
        Object.entries(info2).forEach((key) => {   
            marketInfo.append("h5").text(key[0].toUpperCase().replace("_", " ").replace("_", " ") + ": " + key[1][0] + "\n");
        });
        // call function to create the map Send lat and lng with it
        createMap(info2.lat[0] , info2.lng[0])
    })
}


// Function to create pie chart
function getHomes(input){
    d3.json(`/homes/${input}`).then(function(data){
        var info3 = data
        var y1939 = (info3.year_structure_built_1939_or_earlier[0])
        var y1940 = (info3.year_structure_built_1940_to_1949[0])
        var y1950 = (info3.year_structure_built_1950_to_1959[0])
        var y1960 = (info3.year_structure_built_1960_to_1969[0])
        var y1970 = (info3.year_structure_built_1970_to_1979[0])
        var y1980 = (info3.year_structure_built_1980_to_1989[0])
        var y1990 = (info3.year_structure_built_1990_to_1999[0])
        var y2000 = (info3.year_structure_built_2000_to_2009[0])
        var y2010 = (info3.year_structure_built_2010_to_2013[0])
        var y2014 = (info3.year_structure_built_2014_or_later[0])

        var data = [{
            type: 'pie',
            values: [y1939, y1940, y1950, y1960, y1970, y1980, y1990, y2000, y2010, y2014],
            labels: ["Before 1940", "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010-13", "2014 & newer"],
            // textinfo: "label+percent",
            textposition: 'outside',
            automargin: true 
        }]
        var layout3 = {
            title: `Pie Chart for the Years Structures Built in Zip Code ${input}`,
            showlegend: true,
        }
        Plotly.newPlot("piechart", data, layout3);
                
    })

};
