console.log("my_render.js load!")
// console.log()
$( document ).ready(function() {
    console.log( "ready!" );
    $('#submit').on('click', function (){


    // $.ajax({
    //     type: 'GET',
    //     contentType: 'application/json',
    //     url: 'sample_test',
    //     success: function (e) {
    //         console.log("Success Call -> Sending data to draw charts");
    //         draw_charts(e);
    //     },
    //     error: function(error) {
    //         console.log(error);
    //     }
    // });
    var range = document.getElementById('players_data_input').value;
    console.log("range : ");
    console.log(range)

    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(range, null, '\t'),
        url: 'range_include',
        success: function (e) {
            console.log("Success Call -> Sending data to draw charts");
            // console.log(e)
            draw_charts(e);
        },
        error: function(error) {
            console.log(error);
        }
    });

});

});


function draw_charts(raw_data){
    data=JSON.parse(raw_data)
    
    console.log(data)

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
                return source_group.top(20);
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

    // Bar Country Chart
    let nationality_dimension = data.dimension(item => item.Nationality);
    let nationality_group = nationality_dimension.group().reduceSum(item => 1); 

    // function getTops(source_group) {
    //     return {
    //         all: function () {
    //             return source_group.top(10);
    //         }
    //     };
    // }
    // var nationality_fakeGroup = getTops(nationality_group);

    var pie2 = dc.pieChart("#bar_char");
    pie2
        .width(500)
        .height(300)
        .innerRadius(50)
        .transitionDuration(1000)
        .slicesCap(7)
        // .attr("transform", "translate(50,50")
        .legend(dc.legend().x(400).y(0))
        // .label(function(d) {
        //     return d.key; 
        // })
        .on('pretransition', function(chart) {
            chart.selectAll('text.pie-slice').text(function(d) {
                console.log("pie 3 d")
                console.log(d)
                return dc.utils.printSingleValue(d.data.key );
            })
        })

        .dimension(nationality_dimension)
        .group(nationality_group);
    pie2.render();

    // End of Bar



    var chart = dc.rowChart("#row_char");
    chart
        .width(500)
        .height(800)
        .dimension(club_category)
        .group(fakeGroup)
        .transitionDuration(1000)
        // .ordinalColors(["#56B2EA","#E064CD","#F8B700","#78CC00","#7B71C5"])
        .elasticX(true)

        .xAxis().ticks(5);
    chart.render();


    //  Preferred Positions
    let pre_pos_dimension = data.dimension(item => item.pre_pos);
    let pre_pos_group = pre_pos_dimension.group().reduceSum(item => 1); 

    const res = pre_pos_group.all()
    console.log("Pre Pos Dimension:")
    console.log(res)

    var fakeGroup3 = getTops(pre_pos_group);
    // console.log(fakeGroup)

    var pie3 = dc.pieChart("#player_stat");
    pie3
        .width(500)
        .height(300)
        .innerRadius(50)
        .transitionDuration(1000)
        .externalLabels(50)
        .externalRadiusPadding(50)
        .slicesCap(6)
        // .attr("transform", "translate(50,50")
        .legend(dc.legend().x(400).y(0))
        .label(function(d) {
            return d.key + ': ' + d.value; 
        })
        .dimension(pre_pos_dimension)
        .group(fakeGroup3);

    pie3.on('pretransition', function(chart) {
        chart.selectAll('.dc-legend-item text')
            .text('')
            .append('tspan')
            .text(function(d) { return d.key; })
            .append('tspan')
            .attr('x', 100)
            .attr('text-anchor', 'end')
            .text(function(d) { return d.value; });
    });
    pie3.render();

    // Try Name Group
    // let name_category = data.dimension(item => item.Name)
    // var name_group = name_category.group().reduceSum(item => 1)

    // function names_getTops(source_group) {
    //     return {
    //         all: function () {
    //             return source_group.top(500);
    //         }
    //     };
    // }
    // var name_fake = names_getTops(name_group);

    // const nameResult = name_group.all()
    // console.log("Name Dimension:")
    // console.log(name_fake.all())
    
    // var chart = dc.scatterPlot('#scatter_char');
  
    //  var hwDimension = data.dimension(function(data) { 
    //     return [data.Name, Math.floor(data.Overall)];
    //  });
    //  var hwGroup = hwDimension.group();

    //  const pr_result = hwGroup.all()
    // console.log("hwGroup Dimension:")
    // console.log(pr_result)
  
    //  chart
    //     .width(500)
    //     .height(400)
    //     .x(d3.scaleLinear().domain([0,0]))
    //     .y(d3.scaleLinear().domain([0,0]))
    //     .brushOn(true)
    //     // .xAxisLabel("Height")
    //     // .yAxisLabel("Weight")
    //     .symbolSize(8)
    //     .clipPadding(10)
    //     .dimension(hwDimension)
    //     .group(hwGroup);
  
    //  chart.render();

    var chart1 = dc.barChart('#linechart');
  
//  console.log(datanew)
    //   var ndx            = crossfilter(data),
       let fruitDimension = data.dimension(item => item.Name);
       console.log("---")
       
     let sumGroup = fruitDimension.group().reduceSum(item => item.Overall); 
     function getTops1(source_group) {
        return {
            all: function () {
                return source_group.top(30);
            }
        };
    }
    var fakeGroup1 = getTops1(sumGroup);
     console.log(fakeGroup1.all())
        //   fruitDimension = ndx.dimension(function(d) {console.log("=-=-=");return d.Overall;}),
        //   sumGroup       = fruitDimension.group().reduceSum(function(d) {return d.Overall;});
      chart1
          .width(500)
          .height(300)
          .x(d3.scaleBand())
          .y(d3.scaleLinear().domain([60,93]))
        //   .ordinalColors(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628'])
          .xUnits(dc.units.ordinal)
          .brushOn(false)
          .barPadding(0.4)
          .outerPadding(0.15)
          .dimension(fruitDimension)
          .group(fakeGroup1);
      chart1.render();

    // var chart123 = dc.rowChart("#linechart");
    // chart123
    //     .width(500)
    //     .height(800)
    //     .dimension(fruitDimension)
    //     .group(fakeGroup1)
    //     .transitionDuration(1000)
    //     // .ordinalColors(["#56B2EA","#E064CD","#F8B700","#78CC00","#7B71C5"])
    //     .elasticX(true)

    //     .xAxis().ticks(5);
    // var chart123 = dc.lineChart("#linechart");
    //     chart123
    //       .width(500)
    //       .height(400)
    //       .x(d3.scaleBand())
    //       .y(d3.scaleLinear().domain([55,94]))
    //       .xUnits(dc.units.ordinal)
    //       .brushOn(true)
    //     //   .xAxisLabel('Fruit')
    //     //   .yAxisLabel('Quantity Sold')
    //       .dimension(fruitDimension)
    //       .group(fakeGroup1);
    // //   chart.render();
    // chart123.render();
    

}
