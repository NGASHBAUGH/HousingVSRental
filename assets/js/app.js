function getPlots(id){
    d3.json("/Housing.json").then (sampledata => {
        console.log(sampledata);
        var Zip = sampledata.metadata[0].ZIP;
        var Values =  sampledata.metadata[1].median2018;
        var TopValues = Values.slice(0,10).reverse();
        console.log(TopValues)
        // var labels =  sampledata.metadata[0].ZIP.slice(0,10);
        // console.log (labels);
        var ZipTop = sampledata.metadata[0].ZIP.slice(0,10).reverse();
        var Zip_id = ZipTop.map(d => "Zip " + d);
        var trace   = {
            x: Cost,
            y: Zip_id,
            text: "2018 Median Home Sale Value",
            marker: {
                color: 'blue'},
            type: 'bar',
            orientation: 'h',
        };
        var data = [trace]
    
        var layout = {
            title : 'Top 10 Zip Codes',
            yaxis: {
                tickmode: 'linear'
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30,
            }
        };
        Plotly.newPlot("bar", data, layout);
    })
};

function getDemoInfo(id){
    d3.json("/Housing.json").then 
}

function optionChanged(id) {
    getPlots(id);
    getDemoInfo(id);
}

function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("/Housing.json").then((data)=> {
        console.log(data)
        // get the id data to the dropdwown menu
        data.zip.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlots(data.zip[0]);
        getDemoInfo(data.zip[0]);
    });
}

init()


d3.json("/Housing.json").then ((data) => {
    var metadata = data.metadata;
    console.log(metadata)
    var result = metadata.filter(meta => meta.zip.toString() === zip)[0];
    var demographicInfo = d3.select("#sample-metadata");
    demographicInfo.html("");
    Object.entries(result).forEach((key) => {   
        demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
    });
})