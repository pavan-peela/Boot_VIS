console.log("Player_Dash.js load!")
// console.log()
$('#headers').hide();
$('#headers_two').hide();
$('#headers_three').hide();
$('.x1').hide();
$( document ).ready(function() {
    console.log( "ready!" );
    $('#submit').on('click', function (){
        $('#headers').show();
        $('#headers_three').show();
        $('#headers_two').show();
        $('.x1').show();


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
    

    var stat = document.getElementById('players_stat_input').value;
    console.log("stat : ");
    
    data = range + ',' + stat
    console.log(data)
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data, null, '\t'),
        url: 'player_dash',
        success: function (e) {
            console.log("Success Call -> Sending data to draw charts");
            // console.log(JSON.parse(e))
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

    let club_dimension = data.dimension(item => item.Club);
    let club_group = club_dimension.group().reduceSum(item => 1); 

    function getTops(source_group) {
        return {
            all: function () {
                return source_group.top(25);
            }
        };
    }
    var club_fakeGroup = getTops(club_group);

    var pie1 = dc.pieChart("#pie_cont");
    pie1
        .width(500)
        .height(300)
        .innerRadius(50)
        .transitionDuration(1000)
        .slicesCap(20)
        // .ordinalColors(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628'])
        // .attr("transform", "translate(50,50")
        .legend(dc.legend().x(400).y(0))
        // .label(function(d) {
        //     return d.key; 
        // })

        .on('pretransition', function(chart) {
            chart.selectAll('text.pie-slice').text(function(d) {
                // console.log("pie 3 d")
                // console.log(d)
                return dc.utils.printSingleValue(d.data.key );
            })
        })

        .dimension(club_dimension)
        .group(club_fakeGroup);
    pie1.render();

    //  Preferred Positions
    let pre_pos_dimension = data.dimension(item => item.position);
    let pre_pos_group = pre_pos_dimension.group().reduceSum(item => 1); 

    const res = pre_pos_group.all()
    console.log("Pre Pos Dimension:")
    console.log(res)

    function getTops_position(source_group) {
        return {
            all: function () {
                return source_group.top(30);
            }
        };
    }

    var fakeGroup3 = getTops_position(pre_pos_group);
    // console.log(fakeGroup)

    var pie3 = dc.pieChart("#pre_pos_char");
    pie3
        .width(500)
        .height(390)
        .innerRadius(30)
        .transitionDuration(1000)
        .externalLabels(30)
        .externalRadiusPadding(50)
        .slicesCap(10)
        // .attr("transform", "translate(50,50")
        .legend(dc.legend().x(440).y(0))
        // .label(function(d) {
        //     return d.key + ': ' + d.value; 
        // })
        .dimension(pre_pos_dimension)
        .group(fakeGroup3);

    pie3.on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
            // console.log("pie 3 d")
            // console.log(d)
            return dc.utils.printSingleValue(d.data.key );
        })
    });
    pie3.render();


  
//  console.log(datanew)
    //   var ndx            = crossfilter(data),
       let club_dim_val = data.dimension(item => item.Club);
       console.log("---")
       
     let sumGroup = club_dim_val.group().reduceSum(item => item.ValueNum); 
     function getTops1(source_group) {
        return {
            all: function () {
                return source_group.top(10);
            }
        };
    }

    var fakeGrp = getTops1(sumGroup);
    console.log(fakeGrp.all())
    
    var club_stat = dc.pieChart('#bar_char');
    // var pie1 = dc.pieChart("#pie_cont");
    club_stat
        .width(500)
        .height(300)
        .innerRadius(50)
        .transitionDuration(1000)
        .slicesCap(20)
        // .ordinalColors(['#641E16','#512E5F','#154360','#6E2C00','#424949','#138D75','#D68910'])
        // .attr("transform", "translate(50,50")
        .legend(dc.legend().x(400).y(0))
        .label(function(d) {
            return d.key + ' : ' + d.value; 
        })

        // .on('pretransition', function(club_stat) {
        //     club_stat.selectAll('text.pie-slice').text(function(d) {
        //         // console.log("pie 3 d")
        //         // console.log(d)
        //         return dc.utils.printSingleValue(d.data.key );
        //     })
        // })

        .dimension(club_dim_val)
        .group(fakeGrp);
    club_stat.render();




    let dim = data.dimension(function(data) {
        return [data.Name];
     });
       console.log("This is dim over")
    
     let grp = dim.group().reduceSum(item => item.Overall); 
     function getTops1123(source_group) {
        return {
            all: function () {
                return source_group.top(30);
            }
        };
    }

    var fakeGrp23 = getTops1123(grp);
    console.log(fakeGrp23.all())
    
    // var st_gr = dc.pieChart('#player_stat');
    // // var pie1 = dc.pieChart("#pie_cont");
    // st_gr
    //     .width(500)
    //     .height(300)
    //     .innerRadius(50)
    //     .transitionDuration(1000)
    //     .slicesCap(20)
    //     // .ordinalColors(['#641E16','#512E5F','#154360','#6E2C00','#424949','#138D75','#D68910'])
    //     // .attr("transform", "translate(50,50")
    //     .legend(dc.legend().x(400).y(0))
    //     .label(function(d) {
    //         return d.key + ' : ' + d.value; 
    //     })

    //     // .on('pretransition', function(club_stat) {
    //     //     club_stat.selectAll('text.pie-slice').text(function(d) {
    //     //         // console.log("pie 3 d")
    //     //         // console.log(d)
    //     //         return dc.utils.printSingleValue(d.data.key );
    //     //     })
    //     // })

    //     .dimension(dim)
    //     .group(fakeGrp23);
    //     st_gr.render();
    var chart = dc.rowChart("#player_stat");
    chart
        .width(500)
        .height(830)
        .dimension(dim)
        .group(fakeGrp23)
        .transitionDuration(1000)
        // .ordinalColors(["#56B2EA","#E064CD","#F8B700","#78CC00","#7B71C5"])
        .elasticX(true)

        .xAxis().ticks(5);
    chart.render();




    
    // ###########################Stats start #################################################
    console.log("Computing Stats")

    function getTops1(source_group) {
        return {
            all: function () {
                return source_group.top(10);
            }
        };
    }

    let stat1_dim= data.dimension(function(data) {return [data.Acceleration];});
    let stat2_dim= data.dimension(function(data) {return [data.Dribbling];});
    let stat3_dim= data.dimension(function(data) {return [data.Finishing];});
    let stat4_dim= data.dimension(function(data) {return [data.Strength];});
    let stat5_dim= data.dimension(function(data) {return [data.Stamina];});
    let stat6_dim= data.dimension(function(data) {return [data.Penalties];});
    let stat7_dim= data.dimension(function(data) {return [data.WageNum];});
    let stat8_dim= data.dimension(function(data) {return [data.Vision];});
    let stat9_dim= data.dimension(function(data) {return [data.Volleys];});
    
    
    let stat1_grp = getTops1(stat1_dim.group());
    let stat2_grp = getTops1(stat2_dim.group()); 
    let stat3_grp = getTops1(stat3_dim.group()); 
    let stat4_grp = getTops1(stat4_dim.group()); 
    let stat5_grp = getTops1(stat5_dim.group()); 
    let stat6_grp = getTops1(stat6_dim.group()); 
    let stat7_grp = getTops1(stat7_dim.group()); 
    let stat8_grp = getTops1(stat8_dim.group()); 
    let stat9_grp = getTops1(stat9_dim.group()); 

    // var stat1_fakeGrp = getTops1(stat1_grp);
    console.log(stat1_grp.all())
    
    // Stat 1
    var stat1_graph = dc.pieChart('#stat1');
    stat1_graph
        .width(250)
        .height(200)
        .innerRadius(50)
        .transitionDuration(1000)
        .slicesCap(20)
        .ordinalColors(['#641E16','#512E5F','#154360','#6E2C00','#424949','#138D75','#D68910'])
        .legend(dc.legend().x(400).y(0))
        .label(function(d) {
            return 'Acceleration' + ' : ' + d.key; 
        })
        .dimension(stat1_dim)
        .group(stat1_grp);
    stat1_graph.render();


    // Stat 2
    var stat2_graph = dc.pieChart('#stat2');
    stat2_graph
        .width(250)
        .height(200)
        .innerRadius(50)
        .transitionDuration(1000)
        .slicesCap(20)
        .ordinalColors(['#512E5F','#154360','#6E2C00','#424949','#138D75','#D68910'])
        .legend(dc.legend().x(400).y(0))
        .label(function(d) {
            return 'Dribbling' + ' : ' + d.key; 
        })
        .dimension(stat2_dim)
        .group(stat2_grp);
    stat2_graph.render();


    // Stat 3
    var stat3_graph = dc.pieChart('#stat3');
    stat3_graph
        .width(250)
        .height(200)
        .innerRadius(50)
        .transitionDuration(1000)
        .slicesCap(20)
        .ordinalColors(['#154360','#6E2C00','#424949','#138D75','#D68910'])
        .legend(dc.legend().x(400).y(0))
        .label(function(d) {
            return 'Finishing' + ' : ' + d.key; 
        })
        .dimension(stat3_dim)
        .group(stat3_grp);
    stat3_graph.render();


    // Stat 4
    var stat4_graph = dc.pieChart('#stat4');
    stat4_graph
        .width(250)
        .height(200)
        .innerRadius(50)
        .transitionDuration(1000)
        .slicesCap(20)
        .ordinalColors(['#6E2C00','#424949','#138D75','#D68910'])
        .legend(dc.legend().x(400).y(0))
        .label(function(d) {
            return 'Strength' + ' : ' + d.key; 
        })
        .dimension(stat4_dim)
        .group(stat4_grp);
    stat4_graph.render();


    // Stat 5
    var stat5_graph = dc.pieChart('#stat5');
    stat5_graph
        .width(250)
        .height(200)
        .innerRadius(50)
        .transitionDuration(1000)
        .slicesCap(20)
        .ordinalColors(['#424949','#138D75','#D68910'])
        .legend(dc.legend().x(400).y(0))
        .label(function(d) {
            return 'Stamina' + ' : ' + d.key; 
        })
        .dimension(stat5_dim)
        .group(stat5_grp);
    stat5_graph.render();


    // Stat 6
    var stat6_graph = dc.pieChart('#stat6');
    stat6_graph
        .width(250)
        .height(200)
        .innerRadius(50)
        .transitionDuration(1000)
        .slicesCap(20)
        .ordinalColors(['#D68910','#641E16','#512E5F','#154360','#6E2C00','#424949'])
        .legend(dc.legend().x(400).y(0))
        .label(function(d) {
            return 'Penalties' + ' : ' + d.key; 
        })
        .dimension(stat6_dim)
        .group(stat6_grp);
    stat6_graph.render();


    // Stat 7
    var stat7_graph = dc.pieChart('#stat7');
    stat7_graph
        .width(250)
        .height(200)
        .innerRadius(50)
        .transitionDuration(1000)
        .slicesCap(20)
        .ordinalColors(['#D68910','#6E2C00','#424949','#138D75','#641E16','#512E5F','#154360'])
        .legend(dc.legend().x(400).y(0))
        .label(function(d) {
            return 'Wage ' + ' : ' + d.key; 
        })
        .dimension(stat7_dim)
        .group(stat7_grp);
    stat7_graph.render();


    // Stat 8
    var stat8_graph = dc.pieChart('#stat8');
    stat8_graph
        .width(250)
        .height(200)
        .innerRadius(50)
        .transitionDuration(1000)
        .slicesCap(20)
        .ordinalColors(['#512E5F','#154360','#138D75','#D68910'])
        .legend(dc.legend().x(400).y(0))
        .label(function(d) {
            return 'Vision' + ' : ' + d.key; 
        })
        .dimension(stat8_dim)
        .group(stat8_grp);
    stat8_graph.render();


    // Stat 9
    var stat9_graph = dc.pieChart('#stat9');
    stat9_graph
        .width(250)
        .height(200)
        .innerRadius(50)
        .transitionDuration(1000)
        .slicesCap(20)
        .ordinalColors(['#641E16','#512E5F','#154360','#6E2C00','#424949','#138D75','#D68910'])
        .legend(dc.legend().x(400).y(0))
        .label(function(d) {
            return 'Volleys' + ' : ' + d.key; 
        })
        .dimension(stat9_dim)
        .group(stat9_grp);
    stat9_graph.render();

}