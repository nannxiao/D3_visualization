'use strict';  //treat silly mistakes as run-time errors

var MARGIN_SIZE = {
  left:70,
  bottom:70,
  top:50,
  right:50
}

// margin size for scatter plot 
var MARGIN_SIZE2 = {
	left: 70,
	right:30,
	bottom:70,
	top:40
}

// the SVG element to add visual content 1 to
var svg = d3.select('#visContainer1')
		.append('svg')
		.attr('height', 500) //can adjust size as desired
		.attr('width', 700)
    .style('border','1px solid gray'); //comment out to remove border

var svg2 = d3.select('#visContainer2')
		.append('svg')
		.attr('height', 480) //can adjust size as desired
		.attr('width', 700)
    .style('border','1px solid gray'); //comment out to remove border
	

/* Your script goes here */

// Part I: Bar Chart
//Use the SVG_SIZE and MARGIN_SIZE values to calculate the `width` and `height` 
//of the displayable area of the plot (where the circles will go)
var displayWidth = 700 - MARGIN_SIZE.left - MARGIN_SIZE.right; 
var displayHeight = 500 - MARGIN_SIZE.bottom - MARGIN_SIZE.top;
console.log(displayWidth, displayHeight);

// define the general update function that draws the bar chart of happiness scores
function update1(data){
	var minScore = d3.min(data, function(d){return parseFloat(d.Happiness_Score)});
    var maxScore = d3.max(data, function(d){return parseFloat(d.Happiness_Score)});
    console.log(minScore, maxScore); 

	// create scales for y-values (happiness scores)
	var xScale = d3.scaleLinear()
        .domain([2.905*.95, 7.526])
        .range([0, 660]);

	var xAxisScale = d3.scaleLinear()
        .domain([2.905*.95, 7.526])
        .range([20, 680]);
	
	var scaleColor = d3.scaleLinear()
        .domain([minScore*.95, maxScore])
        .range(['white', '#286090']);

	// append a <g> element in which to place the plotted bars
	var rects = svg.selectAll('rect').data(data);

	var present = rects.enter()
    	.append('rect')
    	.attr('width', 0)
    	.attr('fill', '#286090')
    	.merge(rects);

	present.transition().duration(500)
    	.attr('x', 20)
    	.attr('y', function(d, i){console.log(d); return 20 + i*40})
    	.attr('width', function(d){return xScale(parseFloat(d.Happiness_Score))})
    	.attr('height', 30)
		.attr('fill', function(d){return scaleColor(parseFloat(d.Happiness_Score))})
	
	rects.exit()
    	.transition().duration(500)
    	.attr('width', 0)
    	.remove()

	// add text to show each country
	var texts = svg.selectAll('text').data(data, function(d){return d.Country+d.Happiness_Score})
   	present = texts.enter().append('text')
    .merge(texts)

   	present
      .transition().duration(500)
      .text(function(d){return d.Country})
      .attr('fill', 'white')
      .attr('x', 25)
      .attr('y', function(d, i){console.log(d); return 40+i*40})

    texts.exit().remove()
	
	// add x-axis
	var xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format('.2s'));
	svg.append('g')
        .attr('transform','translate('+0+','+0+')')
        .call(xAxis);

	svg.selectAll('.axis').remove();
	svg.selectAll('.axis').call(xAxis);
}

// use the d3.csv() function to ASYNCHRNOUSLY load the csv file for 2016 data
function barchartInit(){
	d3.csv('data/2016.csv', function(err, data){

		// filter the rows to get the specific area's data we want
		// sort the data by happiness score and take the top 10 countries
		var data1 = data.filter(function(row) {
			return row['Region'] == 'Western Europe';
		});
		data1.sort(function(a,b) {
			return d3.descending(+a.Happiness_Score, +b.Happiness_Score);
		});
		
		var data2 = data.filter(function(row) {
			return row['Region'] == 'Central and Eastern Europe';
		});
		data2.sort(function(a,b) {
			return d3.descending(+a.Happiness_Score, +b.Happiness_Score);
		});
		
		var data3 = data.filter(function(row) {
			return row['Region'] == 'Latin America and Caribbean';
		});
		data3.sort(function(a,b) {
			return d3.descending(+a.Happiness_Score, +b.Happiness_Score);
		});

		var data4 = data.filter(function(row) {
			return row['Region'] == 'Middle East and Northern Africa';
		});
		data4.sort(function(a,b) {
			return d3.descending(+a.Happiness_Score, +b.Happiness_Score);
		});
		
		var data5 = data.filter(function(row) {
			return row['Region'] == 'Sub-Saharan Africa';
		});
		data5.sort(function(a,b) {
			return d3.descending(+a.Happiness_Score, +b.Happiness_Score);
		});
		
		var data6 = data.filter(function(row) {
			return row['Region'] == 'Southern Asia' || row['Region'] == 'Southeastern Asia' || row['Region'] == 'Eastern Asia';
		});
		data6.sort(function(a,b) {
			return d3.descending(+a.Happiness_Score, +b.Happiness_Score);
		});
		
		// handle multiple buttons
		d3.selectAll('button').on('click', function(){
			//get the id of which element caused the event
			var whichButton = d3.select(d3.event.target).attr('id');

			//determine what to do based on that id
			if(whichButton == 'region1'){
				update1(data1);
			}
			else if(whichButton == 'region2'){
				update1(data2);
			}
			else if(whichButton == 'region3'){
				update1(data3);
			}
			else if(whichButton == 'region4'){
				update1(data4);
			}
			else if(whichButton == 'region5'){
				update1(data5);
			}
			else if(whichButton == 'region6'){
				update1(data6);
			}
		});

		// generate initial graph for all countries
		data.sort(function(a,b) {
					return d3.descending(+a.Happiness_Score, +b.Happiness_Score);
				});
		update1(data);
		
	})
};




// Part II : Scatterplot
var displayWidth2 = 700 - MARGIN_SIZE2.left - MARGIN_SIZE2.right;
var displayHeight2 = 480 - MARGIN_SIZE2.top - MARGIN_SIZE2.bottom;

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0.3);

var colorRegion = {
	'Australia and New Zealand': 'Blue',
	'Central and Eastern Europe': 'Gold',
	'Eastern Asia':'MediumSeaGreen',
	'Latin America and Caribbean':'LightPink',
	'Middle East and Northern Africa':'Green',
	'North America':'Orchid',
	'Southeastern Asia':'Goldenrod',
	'Southern Asia':'SteelBlue',
	'Sub-Saharan Africa':'Tomato',
	'Western Europe':'DeepSkyBlue',
};

// select drop list filter
var dropDown = d3.select('#filter');
dropDown.on('change',menuChanged);

function menuChanged(){
	svg2.selectAll('circle')
		.remove();
	var selectedValue = d3.event.target.value;
	if(selectedValue == 'All Regions'){
		scatterInit()
	}
	else{scatterFilter(selectedValue)}
	;
};

function buildLegend(){
	//try legend
	var legendArea = d3.select('#legend')
		.append('svg')
		.attr('height', 100) 
		.attr('width', 600);
	
	console.log('1');
	var legends = legendArea.selectAll('rect').data(colorRegion);
	console.log('2');

	legends.enter()
		.append('rect')
			.attr('x',20)
			.attr('y',10)
			.attr('width', 18)
			.attr('height', 18)
			.attr('fill','red')
			.style('opacity',0.5)
		//.append('text')
			//.attr('x',30)
			//.attr('y',30)
			//.text(function(d,i){return Object.keys(d)[i]});
	
	console.log(Object.keys(colorRegion));
	console.log(Object.values(colorRegion));
}

// show scatter plot for all regions
var scatterInit = function(){
	d3.csv('data/2016.csv', function(err, data){
		console.log(data);

		// Health(Life Expectancy) as xAxis
		var maxLE = d3.max(data,function(d){return parseFloat(d['Life_Expectancy'])});
		var minLE = d3.min(data,function(d){return parseFloat(d['Life_Expectancy'])});

		// Freedom as yAxis
		var maxFd = d3.max(data,function(d){return parseFloat(d.Freedom)});
		var minFd = d3.min(data,function(d){return parseFloat(d.Freedom)});
		
		//console.log(maxEcon, minEcon, maxLE, minLE, maxFd, minFd);

		// create x scale for LE
		var xScale = d3.scaleLinear()
			.domain([minLE, maxLE*1.05])
			.range([0,displayWidth2]);

		// create y scale for Freedom
		var yScale = d3.scaleLinear()
			.domain([minFd, maxFd*1.05])
			.range([displayHeight2,0]);
		
		// add a <g> element for the scatter plot
		var scatter = svg2.append('g')
			.attr('transform','translate('+MARGIN_SIZE2.left+','+MARGIN_SIZE2.top+')')
			.attr('width',displayWidth2)
			.attr('height',displayHeight2);
		
		var circles = scatter.selectAll('circle')
			.data(data);
		
		// assign different color for different continent

		console.log(colorRegion['Sub-Saharan Africa']);

		// add data records to scatter plot, x = d.Freedom, y = d['Health (Life Expectancy)'], size = d['Happiness_Score']
		circles.enter().append('circle')
			.attr('cx',function(d){return xScale(d['Life_Expectancy'])})
			.attr('cy',function(d){return yScale(d.Freedom)})
			.attr('r',function(d){return d['Happiness_Score']*2})
			.attr('fill',function(d){return colorRegion[d.Region]})
			.style('opacity',0.5)
		// show tooltip when mouse-over
		.on("mouseover", function(d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", .9);
			tooltip.html('<strong>' + d['Country'] + '</strong>'
				+ "<br/> Global Rank:" + d['Happiness_Rank'] 
				+ "<br/> Happiness:" + d['Happiness_Score']
				+ "<br/> Freedom:" + d['Freedom']
				+ "<br/> Health:" + d['Life_Expectancy'])
				.style("left", (d3.event.pageX + 5) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
			tooltip.transition()
				.duration(300)
				.style("opacity", 0);
		});

		// set ticks for X & Y axis
		var xAxis2 = d3.axisBottom(xScale).ticks(11); 
		var yAxis2 = d3.axisLeft(yScale).ticks(15);

		//Append xAxis
		svg2.append('g')
		.attr('transform','translate('+MARGIN_SIZE2.left+','+(displayHeight2 + MARGIN_SIZE2.top)+')')
		.call(xAxis2);

		//Append a <g> element to the svg to contain the yAxis
		svg2.append('g')
		.attr('transform','translate('+MARGIN_SIZE2.left+','+(MARGIN_SIZE2.top)+')')
		.call(yAxis2);
		
		// add axis label & ticks
		svg2.append('text')
		.text('Health Score (Life Expectancy)')
		.attr('transform','translate('+ (MARGIN_SIZE2.left + displayWidth2/2.5)+','+(displayHeight2 + MARGIN_SIZE2.top +40)+')')
		svg2.append('text')
		.text('Freedom Score')
		.attr('transform','translate('+(MARGIN_SIZE2.left - 40) + ',' + (MARGIN_SIZE2.top + 2*displayHeight2/3 + 40 )+') rotate(-90)')
		
		// add chart title
		svg2.append('text')
		.text('Scatter Plot of Health x Freedom Scores')
		.attr('transform','translate('+ (MARGIN_SIZE2.left+displayWidth2/4)+','+(MARGIN_SIZE2.top*0.6)+')')
		.attr('font-size',15)
		.attr('font-weight','bold');
		
	})
};

// function to plot scatter plot for one region
function scatterFilter(regionSelected){
	d3.csv('data/2016.csv', function(err, data){
		//console.log(data);

		// Health(Life Expectancy) as xAxis
		var maxLE = d3.max(data,function(d){return parseFloat(d['Life_Expectancy'])});
		var minLE = d3.min(data,function(d){return parseFloat(d['Life_Expectancy'])});

		// Freedom as yAxis
		var maxFd = d3.max(data,function(d){return parseFloat(d.Freedom)});
		var minFd = d3.min(data,function(d){return parseFloat(d.Freedom)});
		
		// create x scale for LE
		var xScale = d3.scaleLinear()
			.domain([minLE, maxLE*1.05])
			.range([0,displayWidth2]);

		// create y scale for Freedom
		var yScale = d3.scaleLinear()
			.domain([minFd, maxFd*1.05])
			.range([displayHeight2,0]);
		
		// add a <g> element for the scatter plot
		var scatter = svg2.append('g')
			.attr('transform','translate('+MARGIN_SIZE2.left+','+MARGIN_SIZE2.top+')')
			.attr('width',displayWidth2)
			.attr('height',displayHeight2);
	
		// add data records to scatter plot, x = d.Freedom, y = d['Health (Life Expectancy)'], size = d['Economy (GDP per Capita)']
		scatter.selectAll('circle')
			.data(data)
			.enter().append('circle')
			.filter(function(d){return d.Region == regionSelected})
				.attr('cx',function(d){return xScale(d['Life_Expectancy'])})
				.attr('cy',function(d){return yScale(d.Freedom)})
				.attr('r',function(d){return d['Happiness_Score']*2})
				.attr('fill',function(d){return colorRegion[d.Region]})
			.style('opacity',0.5)
		// show tooltip when mouse-over
		.on("mouseover", function(d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", .9);
			tooltip.html('<strong>' + d['Country'] + '</strong>'
				+ "<br/> Global Rank:" + d['Happiness_Rank'] 
				+ "<br/> Happiness:" + d['Happiness_Score']
				+ "<br/> Freedom:" + d['Freedom']
				+ "<br/> Health:" + d['Life_Expectancy'])
				.style("left", (d3.event.pageX + 5) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
			tooltip.transition()
				.duration(300)
				.style("opacity", 0);

		legend = svg2.append("g")
			.attr("class","legend")
			.attr("transform","translate(50,30)")
			.style("font-size","12px")
			.call(d3.legend);
		
		  setTimeout(function() { 
				legend
				.style("font-size","20px")
				.attr("data-style-padding",10)
				.call(d3.legend)
			},1000)

		});
	})
};



scatterInit();
barchartInit();