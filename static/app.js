var areaCategory = "Z"
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

function findID (ID) {
    d3.json("ListingType.json").then(function(typeID) {
        var indicatorCodePrice = typeID.ListingTypes[ID]
        return indicatorCodePrice
    })
}


function handleSubmit(){
    d3.event.preventDefault();
    var userInput = d3.select('#input').node().value;
    // console.log(userInput)
    d3.select('#input').node().value = "";

    apiCall(userInput)
    // createMap()
    apiCall(userInput);
    getDemoInfo(userInput)
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
            var minRentRange = medIncome
        }
        if (medIncome> minRent){
            var minRentRange = minRent
        }
        var layout = {
            shapes : [hline], 
            title : "Rental Index",
            yaxis : {
                title : "Rental Price" ,
                range : [ minRentRange - (minRentRange * .01), d3.max(xprice) +d3.min(xprice) *.01]
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

function createMap(latitude , longitude){

    let map 

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    tileSize: 512,
    maxZoom: 50,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: "pk.eyJ1Ijoiam9yZGFudSIsImEiOiJja2dyYjN0MGowMHZ5MnVuenR0ZG8weHl2In0.wlCzpVVa_PgxzWRK2s2rRA"

    //   accessToken: API_KEY
    });
    // Creates map for layers to be placed on. 
    var myMap = L.map("map", {
    center: [
        latitude , longitude

        ],
    zoom: 11
    // layers: [darkmap, earthquakes]
    });
    // Add the steet map to the map as a layer
    streetmap.addTo(myMap)
}

// this is linked to the submit button on the page and activates the search 
d3.select('#Submit').on('click' , handleSubmit);
// Activates the category function and saves what is chosen by the user
d3.selectAll('#main').on('change' , category)




function getDemoInfo(input){
    var ul = d3.select("#sample-metadata")
    ul.html("");

    d3.json(`/sqlsearch/${input}`).then(function(data){
        var info2 = data
        console.log(info2.city[0])
        console.log(info2.lng[0])
        console.log(info2.lat[0])
        createMap(info2.lat[0] , info2.lng[0])




        Object.entries(info2).forEach((key) => { 
            var text = key[0].toUpperCase()
            text = text.replace("_" , " ")
            text = text.replace("_" , " ")
            text = text.replace("_" , " ")
            ul.append("p").text(text+ ": " + key[1][0] + "\n");
        });
    })
}



