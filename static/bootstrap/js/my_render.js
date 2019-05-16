console.log("my_render.js load!")

$( document ).ready(function() {
    console.log( "ready!" );

    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: 'sample_test',
        success: function (e) {
            console.log("Success Call -> Sending data to draw charts");
            draw_charts(e);
        },
        error: function(error) {
            console.log(error);
        }
    });
});

function draw_charts(raw_data){
    data=JSON.parse(raw_data)
    
    console.log(data)

    // array=[]
    // for(var i=0; i< 4;i++){
    //     obj = {}
    //     obj.x=i;
    //     obj.continent= data.children[i].name;
    //     obj.counter = data.children[i].counter[0];
    //     array.push(obj);
        
    // }
    // data=array
    // console.log(data)

    // var data = crossfilter(data);
    // // var chart = dc.scatterPlot("#test");
    // // var chart = dc.scatterPlot('#scatter');
    // let dimensionCategory = data.dimension(item => item.continent)
    // let quantityByCategory = dimensionCategory.group().reduceSum(item => item.counter)
    // // console.log(quantityByCategory)

    // const firstResult = quantityByCategory.all()
    // console.log("First result:")
    // console.log(firstResult)
    const arrayToObject = (array) =>
    array.reduce((obj, item) => {
        obj[item.id] = item
        return obj
    }, {})
    const peopleObject = arrayToObject(data)
    console.log(peopleObject)

    var data = crossfilter(data);

    let dimensionCategory = data.dimension(item => item.Continent)
    // let quantityByCategory = dimensionCategory.group().reduceSum(item => 1)
    // console.log(quantityByCategory)
    var quantityByCategory = dimensionCategory.group(function reduceAdd(p, v) {
        return p + 1;
      });

    const firstResult = quantityByCategory.all()
    console.log("First result:")
    console.log(firstResult)

}