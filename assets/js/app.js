var value = "Z"

d3.json('ListingType.json').then(function (data) {
    // console.log(Object.keys(data.ListingTypes[0]))
    var Listings = Object.keys(data.ListingTypes[0]);
    d3.select('#selDataset').selectAll('option').data(Listings)
    .enter().append("option").html(function (d){
        return d
    })

})
function findID (ID) {
    d3.json("ListingTypes.json").then(function(typeID) {
            
    })
}

function handleSubmit(){
    d3.event.preventDefault();
    var userInput = d3.select('#input').node().value;
    console.log(userInput)
    d3.select('#input').node().value = "";
    apiCall(userInput)
}

function apiCall(input) {
    console.log(input)
    console.log(areaCategory)
    apiKey = ""
    var url = `https://www.quandl.com/api/v3/datasets/ZILLOW/${areaCategory}${input}_?api_key=${apikey}`

}

function category () {
    var areaCat = d3.select('#main');
    var areaCategory = areaCat.node().value;
    var txt = document.getElementById('main').selectedOptions[0].text
    console.log(areaCategory)
    console.log(txt)
    d3.select('#searchLabel').html("").text(`Type ${txt}`)
    return areaCategory
}





d3.select('#Submit').on('click' , handleSubmit);
d3.selectAll('#main').on('change' , category)

function optionChanged () {
    id = d3.select("#selDataset").property('value');
    findID(id)
    return id
}



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

// init()


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



