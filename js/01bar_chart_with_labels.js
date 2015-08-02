/*  Code for two charts is included here (the first time I did the tutorial, I didn't catch that part III worked off of two different data sets).
    The first uses sample data from the exercises in Part I and II of this tutorial, and simply rotates axes.
    The second uses an ordinal scale, where the letters of the alphabet are the names of the data points.
*/


/* Code for an SVG driven d3 bar chart with labels - same data as Parts I and II
/*=============================================================================*/

/* Note - read the header for 00bar_chart.js to learn how to serve an external data file from a local computer.
   Otherwise you'll get errors and nothing will show up on your page. */


// Again, the stuff in the first three chunks of code are all things that don't depend on the data, so they can happen outside of the tsv loader.
var width = 960;
var height = 500;

var y = d3.scale.linear()
    .range([height, 0]);  // Width and heigh flip from the previous exercise because we're rotating the bars to go up and down rather than left to right

var chart = d3.select("#linearchart")
    .attr("width", width)
    .attr("height", height);

// Everything else depends on the values of the data, so we'll encapsulate all of that code inside the tsv loader
d3.tsv("http://localhost:8888/data/00barchartdata.tsv", type, function(error, data) {
    y.domain([0, d3.max(data, function(d) { return d.value; })]); // We flipped the bars, so now we have to do y's domain, not x's

    var barWidth = width / data.length; // Before we could fix the width of the bars and use that to calculate the height of the chart, but since we've flipped axes now we have to start from the width of the chart and move backwards

    var bar = chart.selectAll("g")
        .data(data)
      .enter().append("g")
        .attr("transform", function(d,i) { return "translate(" + i * barWidth + ",0)";});

    bar.append("rect")
        .attr("y", function(d) {return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); }) // SVG's coordinates start from the top left of the screen - whereas mathematical charts like this one more commonly start from the bottom left. So we have to do a conversion here for the y coordinate.
        .attr("width", barWidth - 1);

    bar.append("text")
        .attr("x", barWidth / 2)
        .attr("y", function(d) { return y(d.value) + 3 })
        .attr("dy", ".75em") // This becomes different here because of the axis flipping - before we were anchoring the text at its base and now we are anchoring at its cap
        .text(function(d) { return d.value });
});

function type(d) {
    d.value = +d.value; // Lets you pull real numbers out of your external data file, since the info starts off as strings
    return d;
}




/* Code for an ordinal scaled graph based off letters of the alphabet */
// Note this uses many of the same variables from the chart above, so width, height, and y are not reset here

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var ordinalchart = d3.select("#ordinalchart")
    .attr("width", width)
    .attr("height", height);

d3.tsv("http://localhost:8888/data/01data.tsv", type, function(error, ordinaldata) {
    x.domain(ordinaldata.map(function(d) { return d.name; }));
    y.domain([0, d3.max(ordinaldata, function(d) { return d.value; })]);

    var ordinalbar = ordinalchart.selectAll("g")
        .data(ordinaldata)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x(d.name) + ",0)"; });

    ordinalbar.append("rect")
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x.rangeBand());

    ordinalbar.append("text")
        .attr("x", x.rangeBand() / 2)
        .attr("y", function(d) { return y(d.value) + 3; })
        .attr("dy", "0.75em")
        .text(function(d) { return d.value; });
});