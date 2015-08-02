/* Code for an SVG driven d3 bar chart with labels
/*===============================================*/

/* Note - read the header for 00bar_chart.js to learn how to serve an external data file from a local computer.
   Otherwise you'll get errors and nothing will show up on your page. */


// Again, the stuff in the first three chunks of code are all things that don't depend on the data, so they can happen outside of the tsv loader.
var width = 960;
var height = 500;

var y = d3.scale.linear()
    .range([height, 0]);  // Width and heigh flip from the previous exercise because we're rotating the bars to go up and down rather than left to right

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height);

// Everything else depends on the values of the data, so we'll encapsulate all of that code inside the tsv loader
d3.tsv("http://localhost:8888/data/00barchartdata.tsv", type function(error, data) {
    y.domain([0, d3.max(data function(d) { return d.value; })]); // We flipped the bars, so now we have to do y's domain, not x's

    var barWidth = width / data.length; // Before we could fix the width of the bars and use that to calculate the height of the chart, but since we've flipped axes now we have to start from the width of the chart and move backwards

    var bar = chart.selectAll("g")
        .data(data)
      .enter().append("g")
        .attr("transform", function(d,i) { return "translate(" + i * barWidth + ",0)";});

    bar.append("rect")
        .attr("y", function(d) {return y(d.value); })
        .attr("height", function(d) { return height - y(d.value;) }) // SVG's coordinates start from the top left of the screen - whereas mathematical charts like this one more commonly start from the bottom left. So we have to do a conversion here for the y coordinate.
        .attr("width"), barWidth - 1);

    bar.append("text")
        .attr("x", barWidth / 2)
        .attr("y", function(d) { return y(d.value) + 3 })
        .attr("dy", ".75em") // This becomes different here because of the axis flipping - before we were anchoring the text at its base and now we are anchoring at its cap
        .text(function(d) { return d.value });
});