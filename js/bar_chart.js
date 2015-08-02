
/* Code for a pure HTML-d3 bar chart */
/*===================================*/


var data = [4, 8, 15, 16, 23, 42]; // Sample data, where each value is the length of a bar in the graph we're about to make


// Make a scale that helps the graph to auto compute how wide the bars should be based on the overall range of the data, instead of hardcoding this in when we draw the graph
var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0,420]);


d3.select("#htmlchart")
    .selectAll("div")
    .data(data) // Create nodes that attach each data point to a div inside chart
    .enter() // Create a new node for each data point that doesn't already have one in the form of an existing div, which at the start is all of them
    .append("div") // Attach a div to each node that we just created
    .style("width", function(d) { return x(d) + "px"; }) // Call the scale we wrote above
    .text(function(d) { return d; }); // Add the actual numerical value as right-align text inside the div, so it looks like a label



    /* Code for a pure HTML-d3 bar chart */
/*===================================*/