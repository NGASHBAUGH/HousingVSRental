apiKey = "76d2396840mshc562c26618d33a2p1fb1e6jsn95b66aa3ea3c";

// d3.json(`https://www.quandl.com/api/v3/datasets/ZILLOW/C19607_ZHVISF?api_key=sPG_jsHhtuegYcT7TNWz`).then(function (data){
//     console.log("Salt Lake")    
//     console.log(data)
// });



d3.json(`https://www.quandl.com/api/v3/datasets/ZILLOW/C19496_ZHVISF?api_key=sPG_jsHhtuegYcT7TNWz`).then(function (data){
    console.log(data)
});




function optionChanged () {
    id = d3.select('#selDataset').property('value');
    return id
};