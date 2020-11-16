var areaCategory = "Z"
var count = 0
// TODO 
//  Find out what is wrong with the Indicator codes I have
//   Clean up graphs
//      Add constant lines from Rafael's data
//   add comments to the Javascript 
//  Remove unused code 
//  
var indicatorCodePrice = 'ZHVISF'
var indicatorCodeRental = "ZRISFRR.json"

// //Listing dropdown
// d3.json('ListingType.json').then(function (data) {
//     // console.log(Object.keys(data.ListingTypes[0]))
//     var Listings = Object.keys(data.ListingTypes);
//     d3.select('#selDataset').selectAll('option').data(Listings)
//     .enter().append("option").html(function (d){
//         return d
//     })

// })

// function findID (ID) {
//     d3.json("ListingType.json").then(function(typeID) {
//         var indicatorCodePrice = typeID.ListingTypes[ID]
//         return indicatorCodePrice
//     })
// }


function handleSubmit(){
    d3.event.preventDefault();
    var userInput = d3.select('#input').node().value;
    // console.log(userInput)
    d3.select('#input').node().value = "";
    apiCall(userInput)
    apiCall(userInput);
    getDemoInfo(userInput)
    getHomes(userInput)
}

function apiCall(input) {
    d3.json(`/sqlsearch/${input}`).then(function(data){
        var info = data
        // var info = data.city[0]
        console.log(info)
    });

    // var info = d3.map(cen2018, function(d){
    //     console.log(info)
    // })
    
    apiKey = "sPG_jsHhtuegYcT7TNWz"
    var url = `https://www.quandl.com/api/v3/datasets/ZILLOW/${areaCategory}${input}_${indicatorCodePrice}?start_date=2017-01-01&api_key=${apiKey}`
    // console.log(url)
    d3.json(url).then(function (pulled) {
        console.log(pulled)
        var xprice = []
        var ydate = []
        pulled.dataset.data.forEach(i => { ydate.push(i[0]) });
        pulled.dataset.data.forEach(i => { xprice.push(i[1]) });
        var barT = d3.select('#barText').html("")
        barT.append("h4").text(pulled.dataset.name)
        var trace = {
            x : ydate,
            y : xprice, 
            type : 'bar'
        };

        var barData = [trace];


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

        Plotly.newPlot('bar', barData , layout );
        rentalAPI(areaCategory , input)
    })

}

function rentalAPI(areaCategory , input){
    var url = `https://www.quandl.com/api/v3/datasets/ZILLOW/${areaCategory}${input}_ZRIAH.json?start_date=2017-01-01&api_key=sPG_jsHhtuegYcT7TNWz`

    d3.json(url).then(function (pulled) {
        console.log(pulled)
        var xprice = []
        var ydate = []
        pulled.dataset.data.forEach(i => { ydate.push(i[0]) });
        pulled.dataset.data.forEach(i => { xprice.push(i[1]) });
        var barT = d3.select('#gaugeText').html("")
        barT.append("h4").text(pulled.dataset.name)


        var trace = {
            x : ydate,
            y : xprice, 
            type : 'bar'
        };
        var barData = [trace];

    
        d3.json(`/sqlsearch/${input}`).then(function(data){
            var info1 = data
            var medIncome = (info1.median_household_income[0]/12)/3
            
            // var hline = shline <- function(y = 5000, color = "blue") {
            //         type = "line", 
            //         x0 = "1/1/2018", 
            //         x1 = "1/1/2019", 
            //         xref = "paper",
            //         y0 = medIncome, 
            //         y1 = medIncome
            //         // line = list(color = color)
            //     } 
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
                // line = list(color = color)
            } 
            // return [hline , medIncome]
        // })
        // hline = both[0]
        // medIncome = both[1]
        console.log(hline)
        console.log(medIncome)
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

        Plotly.newPlot('gauge', barData , layout );
    })
    })
}

// using the "Select Area Category" this activates the select option and saves the change
function category () {
    var areaCat = d3.select('#main');
    var areaCategory = areaCat.node().value;
    var txt = document.getElementById('main').selectedOptions[0].text

    d3.select('#searchLabel').html("").text(`Type ${txt}`)

    return areaCategory
}

//MAP
let myMap 

function createMap(latitude , longitude){
    count = 1 + count 
    if (count > 1 ){
        map.remove()
        document.getElementById('contianerMap').innerHTML ="<div id='map' style='height: 400px;'    ></div>" ;
    }

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    tileSize: 512,
    maxZoom: 50,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: "pk.eyJ1Ijoiam9yZGFudSIsImEiOiJja2dyYjN0MGowMHZ5MnVuenR0ZG8weHl2In0.wlCzpVVa_PgxzWRK2s2rRA"

    //   accessToken: API_KEY
    });
    // Creates map for layers to be placed on. 
    console.log("--------------------------------------------")
    console.log(longitude)
    console.log(latitude)

        var myMap = L.map("map", {
    center: [
        latitude , longitude

        ],
    zoom: 12
    // layers: [darkmap, earthquakes]
    });
    // Add the steet map to the map as a layer
    // myMap.setView(new L.LatLng(latitude , longitude), 11)

    streetmap.addTo(myMap)
    
}

// this is linked to the submit button on the page and activates the search 
d3.select('#Submit').on('click' , handleSubmit);
// Activates the category function and saves what is chosen by the user
d3.selectAll('#main').on('change' , category)



function getDemoInfo(input){
    d3.json(`/sqlsearch/${input}`).then(function(data){
        var info2 = data
        console.log(info2.city[0])
        
        var marketInfo = d3.select("#sample-metadata");
        marketInfo.html("");
        Object.entries(info2).forEach((key) => {   
            marketInfo.append("h5").text(key[0].toUpperCase().replace("_", " ").replace("_", " ") + ": " + key[1][0] + "\n");
        });
        createMap(info2.lat[0] , info2.lng[0])
    })
}



// Nathan's Code
// function getDemoInfo(input){
//     var ul = d3.select("#sample-metadata")
//     ul.html("");

//     d3.json(`/sqlsearch/${input}`).then(function(data){
//         var info2 = data
//         console.log(info2.city[0])
//         console.log(info2.lng[0])
//         console.log(info2.lat[0])
//         createMap(info2.lat[0] , info2.lng[0])




//         Object.entries(info2).forEach((key) => { 
//             // var text = key[0].toUpperCase()
//             // text = text.replace("_" , " ")
//             // text = text.replace("_" , " ")
//             // text = text.replace("_" , " ")
//             ul.append("p").text(key[0].toUpperCase() + ": " + key[1][0] + "\n");
//         });
//     })
// }



function getHomes(input){
    d3.json(`/homes/${input}`).then(function(data){
        var info3 = data
        console.log(info3)
        console.log(info3.year_structure_built_1939_or_earlier[0])
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
        console.log(y2014)

        var data = [{
            type: 'pie',
            values: [y1939, y1940, y1950, y1960, y1970, y1980, y1990, y2000, y2010, y2014],
            labels: ["Before 1940", "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010-13", "2014 & newer"],
            textinfo: "label+percent",
            textposition: 'outside',
            automargin: true 
        }]
        var layout3 = {
            title: `Pie Chart for the Years Structures Built in Zip Code ${input}`,
            showlegend: true
        }
        Plotly.newPlot("piechart", data, layout3);
                
    })

};

// var data = [{
//     type: "pie",
//     values: [2, 3, 4, 4],
//     labels: ["Wages", "Operating expenses", "Cost of sales", "Insurance"],
//     textinfo: "label+percent",
//     textposition: "outside",
//     automargin: true
//   }]
  
//   var layout = {
//     height: 400,
//     width: 400,
//     margin: {"t": 0, "b": 0, "l": 0, "r": 0},
//     showlegend: false
//     }
  
//   Plotly.newPlot('pie', data, layout)