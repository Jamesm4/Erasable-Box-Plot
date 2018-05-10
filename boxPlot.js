// Marshall James, 5/10/2018

// Set up variables
let margin = 50;
let boxes = 5;
let svg = d3.select("svg");
let width = svg.style("width").replace("px", "");
let height = svg.style("height").replace("px", "");
let axisWidth = width - 2 * margin;
let axisHeight = height - 2 * margin;
let sectionWidth = axisWidth / boxes;
let barMargin = 25;
let barWidth = sectionWidth - 2 * barMargin;
let erased = false;
let fade = 250;

// Create data
let data = [];

for(let i = 0; i < boxes; ++i) {

    data.push([]);

    for(let j = 0; j < 25; ++j) {

        data[data.length - 1].push(Math.round(Math.random() * 40 + 5))

    }

}

data.forEach(function(d) {d.sort(function(a,b){return a - b});});
data = data.map(function(d) {

    return {
        min: d3.min(d),
        max: d3.max(d),
        q1: d3.quantile(d, .25),
        q2: d3.quantile(d, .50),
        q3: d3.quantile(d, .75)
    }

});

// Set up scales
let yMin = d3.min(data.map(function(d) {return d.min;}));
let yMax = d3.max(data.map(function(d) {return d.max;}));

let yScale = d3.scaleLinear()
    .domain([0, 50])
    .range([axisHeight, 0]);

// Draw axis
let yAxis = d3.axisLeft(yScale)
    .ticks(5)
    .tickPadding(9);

let axis = svg.append("g")
    .attr("width", axisWidth)
    .attr("height", axisHeight)
    .attr("transform", "translate(" + margin + "," + margin + ")")
    .attr("class", "axis")
    .call(yAxis);

let xAxis = axis.append("line")
    .attr("x1", 0)
    .attr("x2", axisWidth)
    .attr("y1", axisHeight)
    .attr("y2", axisHeight)
    .attr("class", "x-axis");

let labels = svg.selectAll("text.label")
    .data(data)
    .enter().append("text")
    .attr("transform", function(d, i) { return "translate(" + (margin + ((i+1) * sectionWidth - (sectionWidth/2))) + "," + (1.5 * margin + axisHeight) + ")"; })
    .attr("class", "label")
    .text(function(d, i) {return String.fromCharCode(65 + i); } );

// Add each box
let wrap = svg.append("g")
    .attr("width", axisWidth)
    .attr("height", axisHeight)
    .attr("transform", "translate(" + margin + "," + margin + ")");

let boxs = wrap.selectAll("g.box")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + (i * sectionWidth) + ",0)"; })
    .attr("width", sectionWidth)
    .attr("height", axisHeight)
    .attr("class", "box");

// Draw lines
let minLines = boxs.append("line")
    .attr("x1", 0)
    .attr("x2", barWidth)
    .attr("y1", function(d) { return yScale(d.min); } )
    .attr("y2", function(d) { return yScale(d.min); } )
    .attr("transform", "translate(" + barMargin + ",0)")
    .attr("class", "min-line");

let maxLines = boxs.append("line")
    .attr("x1", 0)
    .attr("x2", barWidth)
    .attr("y1", function(d) { return yScale(d.max); } )
    .attr("y2", function(d) { return yScale(d.max); } )
    .attr("transform", "translate(" + barMargin + ",0)")
    .attr("class", "max-line");

let q1Lines = boxs.append("line")
    .attr("x1", 0)
    .attr("x2", barWidth)
    .attr("y1", function(d) { return yScale(d.q1); } )
    .attr("y2", function(d) { return yScale(d.q1); } )
    .attr("transform", "translate(" + barMargin + ",0)")
    .attr("class", "q1-line");

let q2Lines = boxs.append("line")
    .attr("x1", 0)
    .attr("x2", barWidth)
    .attr("y1", function(d) { return yScale(d.q2); } )
    .attr("y2", function(d) { return yScale(d.q2); } )
    .attr("transform", "translate(" + barMargin + ",0)")
    .attr("class", "q2-line")
    .attr("class", "q2-line");

let q3Lines = boxs.append("line")
    .attr("x1", 0)
    .attr("x2", barWidth)
    .attr("y1", function(d) { return yScale(d.q3); } )
    .attr("y2", function(d) { return yScale(d.q3); } )
    .attr("transform", "translate(" + barMargin + ",0)")
    .attr("class", "q3-line");

let w1Lines = boxs.append("line")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", function(d) { return yScale(d.min); } )
    .attr("y2", function(d) { return yScale(d.q1); } )
    .attr("transform", "translate(" + (sectionWidth / 2) + ",0)")
    .attr("class", "w1-line");

let w2Lines = boxs.append("line")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", function(d) { return yScale(d.q3); } )
    .attr("y2", function(d) { return yScale(d.max); } )
    .attr("transform", "translate(" + (sectionWidth / 2) + ",0)")
    .attr("class", "w1-line");

let b1Lines = boxs.append("line")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", function(d) { return yScale(d.q1); } )
    .attr("y2", function(d) { return yScale(d.q3); } )
    .attr("transform", "translate(" + barMargin + ",0)")
    .attr("class", "w1-line");

let b2Lines = boxs.append("line")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", function(d) { return yScale(d.q1); } )
    .attr("y2", function(d) { return yScale(d.q3); } )
    .attr("transform", "translate(" + (barMargin + barWidth) + ",0)")
    .attr("class", "w1-line");

// Add hidden dot on median line
let dot = boxs.append("circle")
    .attr("r", 2)
    .attr("cx", sectionWidth/2)
    .attr("cy", function(d) {return yScale(d.q2);});


// Set up erase/redraw functionality
let fadeLines = [xAxis, minLines, maxLines, q1Lines, q2Lines, q3Lines, b1Lines, b2Lines];

d3.select("button").on("click", function() {
        if(!erased) {
            erased = true;
            erase();
        }
        else {
            erased = false;
            redraw();
        }
    });

function erase() {
    fadeLines.forEach(function(l) {
        l.transition(fade).style("opacity", 0);
    });

    dot.transition(fade).style("opacity", 1);
}

function redraw() {
    fadeLines.forEach(function(l) {
        l.transition(fade).style("opacity", 1);
    });

    dot.transition(fade).style("opacity", 0);
}
