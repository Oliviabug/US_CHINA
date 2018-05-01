var width3 = 400;
var height3 = 250;

var margin3 = {
  top: 20,
  right: 70,
  left: 60,
  bottom: 50
}

//append a svg and make it responsive
var svg3 = d3.select("div#lineschart")
   .append("div")
   .classed("svg-container", true) //container class to make it responsive
   .append("svg")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 400 250")
   //class to make it responsive
   .classed("svg-content-responsive", true);


var g3 = svg3.append("g")
           .attr('transform', 'translate(' + margin3.left + ',' + margin3.top + ')');


height3 = height3 - margin3.top - margin3.bottom;
width3 = width3 - margin3.left - margin3.right;



// To be used later for the x axis because we couldn't see the axis well enough
height_axis = height3 + 2;

var parseYear = d3.timeParse('%Y');

var x_scale = d3.scaleTime().range([0, width3]);
var y_scale = d3.scaleLinear().range([height3, 0]);
var color = d3.scaleOrdinal().range(colorbrewer.RdPu[9]);

// Line3 is the variable for all the future lines
var line3 = d3.line()
            .x(function(d) { return x_scale(d.year); })
            .y(function(d) { return y_scale(d.debt); });

console.log(line3);

// add of my data
d3.csv('US-debt-over-year.csv', function(error, data){
 if(error) throw error;

// Turn strings into intergers, this is a tedious way to do it
 data.forEach(function(d, i) {
   d['China'] = +d['China']
   d['Japan'] = +d['Japan']
   d['Ireland'] = +d['Ireland']
   d['Brazil'] = +d['Brazil']
   d['United-Kingdom'] = +d['United-Kingdom']
   d['Switzerland'] = +d['Switzerland']
   d['Cayman-Islands'] = +d['Cayman-Islands']
   d['Luxembourg'] = +d['Luxembourg']
   d['HongKong'] = +d['HongKong']
   d['Taiwan'] = +d['Taiwan']
   d['Saudi-Arabia'] = +d['Saudi-Arabia']
   d['Singapore'] = +d['Singapore']
   d['India'] = +d['India']
   d['Belgium'] = +d['Belgium']
   d['Russia'] = +d['Russia']
   d['Korea-South'] = +d['Korea-South']
   d['Canada'] = +d['Canada']
   d['France'] = +d['France']
   d['Germany'] = +d['Germany']
   d['Bermuda'] = +d['Bermuda']
   d['Thailand'] = +d['Thailand']
   d['United-Arab-Emirates'] = +d['United-Arab-Emirates']
   d['Turkey'] = +d['Turkey']
   d['Norway'] = +d['Norway']
   d['Netherlands'] = +d['Netherlands']
   d['Sweden'] = +d['Sweden']
   d['Poland'] = +d['Poland']
   d['Mexico'] = +d['Mexico']
   d['Australia'] = +d['Australia']
   d['Kuwait'] = +d['Kuwait']
   d['Philippines'] = +d['Philippines']
   d['italy'] = +d['italy']
   d['Spain'] = +d['Spain']
   d['Colombia'] = +d['Colombia']
   d['Israel'] = +d['Israel']
   d['Chile'] = +d['Chile']
   d['Indonesia'] = +d['Indonesia']
   d['South-Africa'] = +d['South-Africa']
   d['Iraq'] = +d['Iraq']
   d['Kazakhstan'] = +d['Kazakhstan']
   d['Peru'] = +d['Peru']
   d['Malaysia'] = +d['Malaysia']
   d['Denmark'] = +d['Denmark']
   d['Vietnam'] = +d['Vietnam']
   d['Oman'] = +d['Oman']
   d['All-Other'] = +d['All-Other']
   d.year = parseYear(d.year);
 })

// Slice my data so I only keep the columns I am interested in
 var countries = data.columns.slice(1).map(function(id){
   return {
     id:id,
     values: data.map(function(d){
       return  {year: d.year, debt: d[id]}
     })
   };
 });

 console.log(countries);

 x_scale.domain(d3.extent(data, function(d) { return d.year; }));

 y_scale.domain([
 d3.min(countries, function(c) { return d3.min(c.values, function(d) { return d.debt; }); }),
 d3.max(countries, function(c) { return d3.max(c.values, function(d) { return d.debt; }); })
]);

color.domain(countries.map(function(d){ return d.id; }));

// Call the axis
g3.append("g")
   .attr("class", "axis axis--x")
   .attr("transform", "translate(0," + height_axis + ")")
   .call(d3.axisBottom(x_scale));

g3.append("g")
   .attr("class", "axis axis--y")
   .call(d3.axisLeft(y_scale))
 .append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 2)
   .attr("dy", "0.71em")
   .attr("fill", "#000")
   .attr('font-size', '0.7em')
   .text("Debt owned in $million");


// Call the lines
   var country = g3.selectAll(".country")
     .data(countries)
     .enter().append("g")
       .attr("class", "country");

       // Append the name of the countries. But only for China and Japan that's why I have a if loop
          country.append("text").attr('class', 'country_label')
              .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
              .attr("transform", function(d) { return "translate(" + x_scale(d.value.year) + "," + y_scale(d.value.debt) + ")"; })
              .attr("x", 3)
              .attr('id', function(d){ return 'label-' + d.id; })
              .attr("dy", "0.35em")
              .style("font", "11px sans-serif")
              .style("opacity", function(d){
                if(d.id === 'China' || d.id === 'Japan') {
                  return 1
                } else {
                 return 0
                }
              })
              .text(function(d) {
                if(d.id === 'China' || d.id === 'Japan') {
                  return d.id
                } else {
                 return d.id
                }
              });


   country.append("path")
       .attr("class", "lines")
       .attr("d", function(d) { return line3(d.values); })
       .style("stroke", function(d) {
          if(d.id === 'China') {
            return 'rgb(141, 211, 199)'
          } else if ( d.id === 'Japan') {
            return 'rgb(251,  128, 114)'
          } else {
            return 'lightGrey'
          }
        })
       .style('stroke-width', '1 px')
       .style('fill', 'rgba(0, 0, 0, 0)')
       .on('mouseover', function(d){
         var country_line = d3.select(this);
         //console.log(country_line);
         country_line.style('stroke', function(d){
           if(d.id === 'China') {
             return 'rgb(141, 211, 199)'
           } else if (d.id === 'Japan') {
             return 'rgb(251, 128, 114)'
           } else {
             return 'orange'
           }
         })
        .style('stroke-width', '1.5px')

        var label = d3.select('#label-' + d.id);
          label.style('opacity', 1);

       })
       .on('mouseout', function(d){
         var country_line = d3.select(this);
         country_line.style('stroke', function(d){
         if(d.id === 'China') {
           return 'rgb(141, 211, 199)'
         } else if (d.id === 'Japan') {
           return 'rgb(251, 128, 114)'
         } else {
           return 'lightGrey'
         }
       })
        .style('stroke-width', '1px')

        var label = d3.select('#label-' + d.id);
          label.style('opacity', function(d){
          if(d.id === 'China' || d.id === 'Japan') {
            return 1
          } else {
            return 0
          }
          })
          .style('font-size', function(d){
          if(d.id === 'China' || d.id === 'Japan') {
            return '.7rem'
          } else {
            return '0.7rem'
          }
        })
       });






})
