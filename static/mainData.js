function getDemoInfo(id){
    var cen2018 = d3.json(`/sqlsearch/${input}`).then(function(data){
        console.log(data)
        
        Object.entries(result).forEach((key) => {   
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    })
}


var cen2018 = d3.json(`/sqlsearch/${input}`).then(function(data){
    console.log(data)
})