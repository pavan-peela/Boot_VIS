console.log("my_render.js load!")
// console.log()
$( document ).ready(function() {
    $('#submit').on('click', function (){
        
    });
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
    // const arrayToObject = (array) =>
    // array.reduce((obj, item) => {
    //     obj[item.id] = item
    //     return obj
    // }, {})
    // const peopleObject = arrayToObject(data)
    // console.log(peopleObject)

    var data = crossfilter(data);
    
    // Continent Group
    let continent_category = data.dimension(item => item.Continent)
    var continent_group = continent_category.group().reduceSum(item => 1)

    // let quantityByCategory = dimensionCategory.group().reduceSum(item => 1)
    // console.log(quantityByCategory)
    // var quantityByCategory = dimensionCategory.group(function reduceAdd(p, v) {
    //     return p + 1;
    //   });
    const firstResult = continent_group.all()
    console.log("Continent Dimension:")
    console.log(firstResult)

    // Club Group
    let club_category = data.dimension(item => item.Club)
    var club_group = club_category.group().reduceSum(item => 1)

    console.log("Club Dimension:")
    
    function getTops(source_group) {
        return {
            all: function () {
                return source_group.top(10);
            }
        };
    }
    var fakeGroup = getTops(club_group);
    // console.log(fakeGroup)

    var pie1 = dc.pieChart("#pie_cont");
    pie1
        .width(500)
        .height(300)
        .innerRadius(25)
        .transitionDuration(1000)
        .slicesCap(6)
        // .attr("transform", "translate(50,50")
        .legend(dc.legend().x(400).y(0))
        .label(function(d) {
            return d.key + ': ' + d.value; 
        })
        .dimension(continent_category)
        .group(continent_group);
    pie1.render();




    var chart = dc.rowChart("#row_char");
    chart
        .width(500)
        .height(300)
        .dimension(club_category)
        .group(fakeGroup)
        .transitionDuration(1000)
        .ordinalColors(["#56B2EA","#E064CD","#F8B700","#78CC00","#7B71C5"])
        .elasticX(true)

        .xAxis().ticks(5);
    chart.render();


    // Try Name Group
    let name_category = data.dimension(item => item.Name)
    var name_group = name_category.group().reduceSum(item => 1)

    function names_getTops(source_group) {
        return {
            all: function () {
                return source_group.top(500);
            }
        };
    }
    var name_fake = names_getTops(name_group);

    const nameResult = name_group.all()
    console.log("Name Dimension:")
    console.log(name_fake.all())
    
    var chart = dc.scatterPlot('#scatter_char');
  
     var hwDimension = data.dimension(function(data) { 
        return [data.Name, Math.floor(data.Overall)];
     });
     var hwGroup = hwDimension.group();

     const pr_result = hwGroup.all()
    console.log("hwGroup Dimension:")
    console.log(pr_result)
  
     chart
        .width(500)
        .height(400)
        .x(d3.scaleLinear().domain([0,0]))
        .y(d3.scaleLinear().domain([0,0]))
        .brushOn(true)
        // .xAxisLabel("Height")
        // .yAxisLabel("Weight")
        .symbolSize(8)
        .clipPadding(10)
        .dimension(hwDimension)
        .group(hwGroup);
  
     chart.render();
}