(function () {

var width = 420;
var height = 250;

var margin = {
  top: 20,
  right: 70,
  left: 90,
  bottom: 50
}

//piece of code to append a svg and make it responsive
var svg = d3.select("div#areachart")
   .append("div")
   .classed("svg-container", true) //container class to make it responsive
   .append("svg")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 450 250")
   //class to make it responsive
   .classed("svg-content-responsive", true);


var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


height = height - margin.top - margin.bottom;
width = width - margin.left - margin.right;

// Introduce a variable to parse the time because I have a date variable
var parseDate = d3.timeParse("%Y");

var x = d3.scaleTime().range([0, width])
var y = d3.scaleLinear().range([height, 0])
var color_scale = d3.scaleOrdinal().range(colorbrewer.RdPu[9]);


// define the 1st line
var valueline = d3.line()
    .x(function(d) { return x(d.years); })
    .y(function(d) { return y(d.IYR); });

// define the 2nd line
var valueline2 = d3.line()
    .x(function(d) { return x(d.years); })
    .y(function(d) { return y(d.EYR); });

//Define the area
var area = d3.area()
            .x(function(d, i){
              return x(d.years)
            })
            .y0(function(d){
              return y(d.IYR)
            })
            .y1(function(d){
              return y(d.EYR)
            });

// attempt to create a tooltip with mousemove - on the right track but not complete
const tooltip = d3.select('#tooltip');
const tooltipLine = svg.append('line');

let trade, tipBox;

// add the csv
d3.csv('china-focus.csv', function(error, data){

    if (error) throw error;

//Turn my string variables into integer variables
  data.forEach(function(d, i){
    d.IYR = +d.IYR;
    d.EYR = +d.EYR;
    d.years = parseDate(d.years);
  })


  x.domain(d3.extent(data, function(d) { return d.years; }));
  y.domain([0, d3.max(data, function(d) { return Math.max( d.IYR, d.EYR); })]);




//append path for the area representing the US-China trade deficit
      g.append("path")
        .datum(data)
        .attr("fill", "rgb(255, 255, 179)")
        .attr("d", area);


  // Add the valueline path.
    g.append("path")
        .datum(data)
        .attr("class", "line")
        .style('fill', 'none')
        .style('stroke', 'rgb(251,  128, 114)')
        .style('stroke-width', '2px')
        .attr("d", valueline);

  // Add the valueline2 path.
  g.append("path")
      .datum(data)
      .attr("class", "line")
      .style('fill', 'none')
      .style('stroke-width', '2px')
      .style("stroke", "rgb(141, 211, 199)")
      .attr("d", valueline2);

// call my axis
      g.append("g")
          .style("font-size", "8px")
          .style("font-family", "Times")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      g.append("g")
          .style("font-size", "8px")
          .style("font-family", "Times")
          .call(d3.axisLeft(y))
        .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("in millions of $");

// Another way to append labels
// var label_data = [
//   {
//     label: "$230 billion of trade deficit",
//     x: '610px',
//     y: '220px',
//     width: '30px',
//     height: '90px'
//   }
// ]

// append additional text
    var labels = svg.append('g')
    labels.append('text')
      .attr("x", "255px")
       .attr("y", '120px')
       .attr('width', '30px')
       .attr('height', '90px')
       .style('font-weight', 'bold')
       .style('font-family', 'Times')
       .style('font-size', '8px')
       .text( '$375 billion of trade deficit');

// Import label
     labels.append('text')
       .attr("x", "320px")
        .attr("y", '18px')
        .attr('width', '30px')
        .attr('height', '90px')
        .style('font-weight', 'bold')
        .style('font-family', 'Times')
        .style('font-size', '9px')
       .style('fill', 'rgb(251,  128, 114)')
        .text( 'Import');

// export label
        labels.append('text')
          .attr("x", "320px")
           .attr("y", '170px')
           .attr('width', '30px')
           .attr('height', '90px')
           .style('font-weight', 'bold')
           .style('font-family', 'Times')
           .style('font-size', '9px')
          .style('fill', 'rgb(141, 211, 199)')
           .text( 'Export');




 });

 })()
