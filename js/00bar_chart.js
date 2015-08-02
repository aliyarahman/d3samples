// Code for two charts is included here: Part I, a pure HTML chart, and Part II, which is built off SVG elements


/* Part I - Code for a pure HTML-d3 bar chart */
/*===================================*/

/* Note this code does not rotate x and y axes - so bars extend left to right across page */


var data = [4, 8, 15, 16, 23, 42]; // Sample data, where each value is the length of a bar in the graph we're about to make

var width = 420; // Need this for the scaling below

// Make a scale that helps the graph to auto compute how wide the bars should be based on the overall range of the data, instead of hardcoding this in when we draw the graph
var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0,width]);


d3.select("#htmlchart")
    .selectAll("div")
    .data(data) // Create nodes that attach each data point to a div inside chart
    .enter() // Create a new node for each data point that doesn't already have one in the form of an existing div, which at the start is all of them
    .append("div") // Attach a div to each node that we just created
    .style("width", function(d) { return x(d) + "px"; }) // Call the scale we wrote above
    .text(function(d) { return d; }); // Add the actual numerical value as right-align text inside the div, so it looks like a label



/* Code for an SVG-d3 bar chart */
/*===================================*/

/*  NOTE - this code will not work if you are just grabbing a tsv off your local machine - it has to be served.
    Easiest thing is to navigate to where the tsv is and type:
        python -m SimpleHTTPServer 8888
    Server will start. You then need to do two things for this to work in your d3 code: 
      (1)Reference the file below like: http://localhost:8888/file_path.tsv , and 
      (2)Don't directly open the html file in your browser. Instead, open localhost:8888, then browse to the html file. THEN it will work, because you are using the same origin (localhost) to get to both the html and the tsv files.
*/

// These four chunks can all happen without data loading, so they'll not be encapsulated by the tsv loader's brackets
var barHeight = 20;

var svgchart = d3.select("#svgchart")
    .attr("width", width)
    .attr("height", barHeight * data.length);

var xsvg = d3.scale.linear()
    .range([0, width]);

var chart = d3.select("#svgchart")
    .attr("width", width);


// Everything else (except for functions) has to happen after we have the data, and since d3 is ansynchronous, if we put these commands outside the loader brackets, the code will run before the data is downloaded and it won't work

    d3.tsv("http://localhost:8888/data/00barchartdata.tsv", type, function(error, barchartdata) { // Note the "type" thing is the function below that we run to get numbers out of the strings in the file
        xsvg.domain([0, d3.max(barchartdata, function(d) { return d.value; })]); // The scale can be set without the data, but not the domain. If we don't set the domain, we get window sized domain which will flow off the svg chart.
        svgchart.attr("height", barHeight * barchartdata.length); // We need the number of data points to calculate the chart's entire height.

        // The bar variable is going to be an array of nodes - no rectangles attached yet
        var bar = svgchart.selectAll("g") // A "g" element is a "group". transforms and translates happen to all the child elements within it
            .data(barchartdata) // Bind data to all the nodes that exist.
          .enter().append("g") // Create any nodes for data points that didn't already have one (so when it loads this is all of them)
            .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; }); // Calculates how much to move each bar down on the y scale

        bar.append("rect")  // Attach an svg rectangle to each d3 node we made in the array above
            .attr("width", function(d) { return xsvg(d.value); }) // Since it's now fetching from a file, we have to have a function return the variable - it's not already in the scope of this code. Also, we need the value attribute of the object, because the file has both a name and a number
            .attr("height", barHeight - 1); // Minus 1 lets us have space between them
            

        bar.append("text")
            .attr("x", function(d) {return xsvg(d.value) - 3; })
            .attr("y", barHeight / 2)
            .attr("dy", "0.35em") // This is an additional y offset relative to the pixel one we set above - it's relative to the font size so it will auto center the text vertically when text size changes
            .text(function(d) { return d.value; }); // Grab the numerical value as the text label for the element
    });

// Helps us retrive numbers from the tsv file
function type(d) {
    d.value = +d.value; // Change the value from a string to a number so you can do math on it
    return d;
}