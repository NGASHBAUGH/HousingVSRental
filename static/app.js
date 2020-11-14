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
}

function apiCall(input) {
    // console.log(input)
    // console.log(areaCategory)
    var cen2018 = d3.json(`/sqlsearch/${input}`).then(function(data){
        console.log(data)
        return data
    });
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


        // console.log(Promise.resolve(cen2018))
        // var d1 = {date:"1/1/2018",close: data.median_household_income["0"] };
        // var d2 = {date:"1/1/2019",close: data.median_household_income["0"] };

        // svg.append("line")
        // .attr({ x1: x(d1.date), y1: y(d1.close), //start of the line
        //         x2: x(d2.date), y2: y(d2.close)  //end of the line
        //       });
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
        var xprice = []
        var ydate = []
        pulled.dataset.data.forEach(i => { ydate.push(i[0]) });
        pulled.dataset.data.forEach(i => { xprice.push(i[1]) });
        var barT = d3.select('#gaugeText').html("")
        barT.append("h4").text(pulled.dataset.name)
        // console.log(ydate)
        // console.log(Object.values(pulled))
        var trace = {
            x : ydate,
            y : xprice, 
            type : 'bar'
        };
        var barData = [trace];
        // console.log(d3.min(xprice) *.05)
        // console.log(d3.min(xprice))
        // console.log(d3.max(xprice))

        var layout = {
            title : "Rental Index",
            yaxis : {
                title : "Rental Price" ,
                range : [ d3.min(xprice) -d3.min(xprice) *.01 , d3.max(xprice) +d3.min(xprice) *.01]
            },
            xaxis : {
                title : "Year"
            }
        };

        Plotly.newPlot('gauge', barData , layout );
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




// this is linked to the submit button on the page and activates the search 
d3.select('#Submit').on('click' , handleSubmit);
// Activates the category function and saves what is chosen by the user
d3.selectAll('#main').on('change' , category)



// // Activated by the user, saves the type of info they want
// function optionChanged () {
//     id = d3.select("#selDataset").property('value');
//     var indicatorCodePrice = findID(id)
//     return indicatorCodePrice
// }



// init()

// function getPlots(id){
//     d3.json("/Housing.json").then (sampledata => {
//         console.log(sampledata);
//         var Zip = sampledata.metadata[0].ZIP;
//         var Values =  sampledata.metadata[1].median2018;
//         var TopValues = Values.slice(0,10).reverse();
//         console.log(TopValues)
//         // var labels =  sampledata.metadata[0].ZIP.slice(0,10);
//         // console.log (labels);
//         var ZipTop = sampledata.metadata[0].ZIP.slice(0,10).reverse();
//         var Zip_id = ZipTop.map(d => "Zip " + d);
//         var trace   = {
//             x: Cost,
//             y: Zip_id,
//             text: "2018 Median Home Sale Value",
//             marker: {
//                 color: 'blue'},
//             type: 'bar',
//             orientation: 'h',
//         };
//         var data = [trace]
    
//         var layout = {
//             title : 'Top 10 Zip Codes',
//             yaxis: {
//                 tickmode: 'linear'
//             },
//             margin: {
//                 l: 100,
//                 r: 100,
//                 t: 100,
//                 b: 30,
//             }
//         };
//         Plotly.newPlot("bar", data, layout);
//     })
// };

// function getDemoInfo(id){
//     d3.json("/Housing.json").then 
// }

// function optionChanged(id) {
//     getPlots(id);
//     getDemoInfo(id);
// }


// // function button ()

// function init() {
//     // select dropdown menu 
//     var dropdown = d3.select("#selDataset");


//     // read the data 
//     d3.json("/Housing.json").then((data)=> {
//         console.log(data)
//         // get the id data to the dropdwown menu
//         data.zip.forEach(function(name) {
//             dropdown.append("option").text(name).property("value");
//         });

//         // call the functions to display the data and the plots to the page
//         getPlots(data.zip[0]);
//         getDemoInfo(data.zip[0]);
//     });
// }




// d3.json("/Housing.json").then ((data) => {
//     var metadata = data.metadata;
//     console.log(metadata)
//     var result = metadata.filter(meta => meta.zip.toString() === zip)[0];
//     var demographicInfo = d3.select("#sample-metadata");
//     demographicInfo.html("");
//     Object.entries(result).forEach((key) => {   
//         demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
//     });
// })



