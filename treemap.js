// The width and height of my different graphs should all have different varibale name
var width2 = 900;
var height2 = 500;

// Same for the margin as well as for the svg and g varibales
var margin2 = {
  top: 0,
  right: 0,
  left: 0,
  bottom: 20
};



//append a svg and make it responsive
var svg2 = d3.select("div#treemap")
   .append("div")
   .classed("svg-container", true) //container class to make it responsive
   .append("svg")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 950 650")
   //class to make it responsive
   .classed("svg-content-responsive", true);


 /*This creates a div for the tooltip*/
       var div_tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

// to move the tooltip on the front
  d3.selection.prototype.moveToFront = function() {
     return this.each(function(){
       this.parentNode.appendChild(this);
     });
   };


var colour_scale = d3.scaleOrdinal().range(colorbrewer.Set3[9]);

// First step to create my treemap. It subdivides area into rectangles
var treemap = d3.treemap()
  .size([width2, height2])
  .padding(1.5)
  .round(true);

height2 = height2 - margin2.top - margin2.bottom;
width2 = width2 - margin2.right - margin2.left;




// Add my data into my code
d3.csv('US-debt-treemap.csv', function(error, data){
  if(error) throw error;

  data.forEach(function(d) {
    d.Total = +d.Total;
  });

  colour_scale.domain(data.map(function(d){ return d.continent}));

// This nest variable is a way to group data.
    var nest = d3.nest()
      .key(function(d) {
        return d.Countries;
      })
      .key(function(d){
        return d.continent;
      })
      .rollup(function(leaves) {
          return d3.sum(leaves, function(d) {
            return d['Dec-17'];
          })
        });


// Set a hierarchy for the layout of the treemap
      var root = d3.hierarchy({
          values: nest.entries(data)
        }, function(d) {
          return d.values;
        })
        .sum(function(d) {
          return d.value;
        })
        .sort(function(a, b) {
          return b.value - a.value;
        });

      treemap(root);

// Create the node which will be display as rectangles
      var nodes = d3.select('#treemap').select('svg')
        .selectAll(".node")
        .data(root.leaves());


      nodes
        .exit()
        .remove();


      var new_nodes = nodes
                      .enter()
                      .append('rect')
                      .attr('class', 'node')
                      .style('fill', function(d) { console.log(d); return colour_scale(d.data.key)})
                      .attr('id', function(d){ return d.data.key})




// Merge all the nodes and set their size and location
        nodes.merge(new_nodes)
          .style("x", function(d) {
            return d.x0 + "px";
          })
          .style("y", function(d) {
            return d.y0 + "px";
          })
          .style("width", function(d) {
            return d.x1 - d.x0 + "px";
          })
          .style("height", function(d) {
            return d.y1 - d.y0 + "px";
          })

//Each rectangle will have a text inside.
          var texts = svg2.selectAll(".mytexts")
                                      .data(root.leaves())
                                      .enter()
                                      .append("text");


nodes.merge(new_nodes)
         .on('mouseover', function(d){
           var selected_label = d3.select(this).select(".mytexts");
           d3.select(this)
             .style('background', "lightYellow")
             // .style('overflow', 'visible')
             // .style('z-index', 100);/*Layers in the screen have a default z-index of 1 so if a layer is higher than 1 is gonna show infront of whatever has a lower index*/
           d3.select(this).select(".mytexts")
             .style("overflow", "visible")
             .style('font-weight', 'bold')
             .style('font-size','18px')
             .style("word-wrap", "break-word");
           div_tooltip.transition()
             .duration(200)
            .style("opacity", .9);
           div_tooltip.text(d.parent.data.key + ': $' + d.data.value + " million")
            .attr("text-align", "center")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
           div_tooltip.moveToFront();
         })


// Because the text was sometimes overlapping the borders of the rectangle, I created many if loops to adjust my text
          texts.attr("class", "value")
              .attr("x", function(d){
                if(d.parent.data.key === 'Cayman-Islands') {
                  return d.x0 + 7 + "px"
                } else if (d.parent.data.key === 'HongKong' ||d.parent.data.key === "Russia"  || d.parent.data.key === "Belgium"  || d.parent.data.key === "Korea" || d.parent.data.key === "Poland" || d.parent.data.key === "Italy"  ){
                  return d.x0 - 15 + "px"
                } else if ( d.parent.data.key === 'United-Arab-Emirates' || d.parent.data.key === "Sweden" || d.parent.data.key === 'Netherlands' || d.parent.data.key === 'Philippines') {
                  return d.x0 -20 + "px"
                } else if(d.parent.data.key === 'Canada' ||d.parent.data.key === 'Turkey' || d.parent.data.key === 'Norway') {
                  return d.x0 - 25 + "px"
                } else if (d.parent.data.key === 'Kuwait' || d.parent.data.key === 'Australia' || d.parent.data.key === 'Spain' || d.parent.data.key === "Mexico") {
                  return d.x0 - 35 + "px"
                } else if(d.parent.data.key === 'China' || d.parent.data.key === 'Japan') {
                  return d.x0 + 110 + 'px'
                } else if(d.parent.data.key === 'Cayman-Islands' || d.parent.data.key === 'Mexico') {
                  return d.x0 - 55 + "px"
                } else if(d.parent.data.key === 'United-Kingdom') {
                  return d.x0 + 15 + 'px'
                } else {
                  return d.x0 + "px"
                }

              })
              .attr("y", function(d){ console.log(d.y0); return d.y0 + "px"; })
              .style("width", function(d) {
                return d.x1 - d.x0 + "px";
              })
              .style("height", function(d) {
                return d.y1 - d.y0 + "px";
              })
              .attr("dx", +50)
              .attr("dy", "1.25em")
              .attr('font-size', function(d){
                if(d.parent.data.key === 'China' || d.parent.data.key === 'Japan') {
                  return '28px'
                } else if (d.parent.data.key === 'Spain') {
                  return "9px"
                } else {
                  return "13px"
                }
              })
              .attr("text-anchor", "middle")
              .style("fill", 'black')
              .style('font-family', 'sans-serif')
              .html(function(d) {
                if(d.parent.data.key === 'United-Arab-Emirates') {
                  return 'UAE'
                } else if(d.parent.data.key === 'Netherlands') {
                  return 'NL'
                } else if (d.parent.data.key === 'Australia') {
                  return 'AUS'
                } else if (d.parent.data.key === 'Philippines') {
                  return 'PHL'
                } else if (d.parent.data.key === 'Kuwait') {
                  return 'KW'
                } else if(d.parent.data.key === 'China' ) {
                  return (d.parent.data.key + ': $' + '<br />' + '1.2 trillion')
                } else if (d.parent.data.key == 'Japan') {
                  return (d.parent.data.key + ': $' + '<br />' + ' 1.1 trillion')
                } else if(d.parent.data.key === 'Cayman-Islands') {
                return 'Cayman Isl';
              } else if(d.parent.data.key === 'Mexico') {
                return 'MEX';
                } else {
                  return d.parent.data.key;
                }
                 });


 });
