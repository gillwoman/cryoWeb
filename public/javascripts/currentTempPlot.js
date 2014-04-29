var data = [];
var margin = {top: 30, right: 30, bottom: 30, left: 60},
    width = 500 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
var datLength = 20;

// initialise chart
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// create X axis
var xAxis = d3.svg.axis()
    .orient("bottom");
xAxis.tickFormat(function(d) { return d3.time.format("%H:%M:%S")(new Date(d)); })
    .ticks(5); // max. no. ticks
//xAxis.tickFormat(function(d) { return d3.time.format("%H:%M")(d); });
chart.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + height + ")")
    .append("text")
    .attr("y",20)
    .attr("x",(width - margin.right)/2)
    .attr("dy", ".71em")
    .style("text-anchor", "middle")
    .text("Time");
// create Y axis
var yAxis = d3.svg.axis()
    .orient("left");
chart.append("g")
    .attr("class","y axis")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y",-60)
    .attr("x",-20)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Temperature (K)");

// create path generator
var path = chart.append("path")
    .attr("class","line");

setInterval(function() {
    $.getJSON("./data?type=status&data=T", function(res) {
        // Update data
        data.push({time: new Date(), T: Math.round(
            res.T*1000)/1000});
        while (data.length > datLength) {
            data.shift();
        }

        // update axes
        var x = d3.scale.linear()
            .domain([d3.min(data,getTime), d3.max(data,getTime)])
            .range([0, width]);
        var circleWidth = width/data.length;
        var y = d3.scale.linear()
            .domain([1.1*d3.min(data,getT)
            -0.1*d3.max(data,getT), d3.max(data,getT)])
            .range([height, 0]);
        chart.selectAll(".x.axis")
            .call(xAxis.scale(x));
        chart.selectAll(".y.axis")
            .call(yAxis.scale(y));

        // data join
        var line = d3.svg.line()
            .x(function(d) { return x(d.time); })
            .y(function(d) { return y(d.T); })
            .interpolate("linear");
        path.datum(data)
            .attr("d", line);


        // AXIS
        // join
        chart.selectAll(".axis");
        // update
    })
},1000);

getT = function(data) { return data.T; }
getTime = function(data) { return data.time; }