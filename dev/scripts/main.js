const apiUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';
console.log('connected');

const api_key2010 = 'http://atlas.media.mit.edu/hs92/export/2010/show/all/all/';
d3.json(api_key2010, function(d) {
	d.data.forEach((d) => {
		console.log(numeral(d.export_val).format('0.0a'));
	})
});

var width = 700, 
	height = 400;

var barChart = d3.json(apiUrl, function(e,d){
	if(e) console.warn(e);

	var canvas, 
		rect, 
		yScale, 
		xScale,
		colorScale,
		tooltip,
		tempColor;

	var margin = { top: 0, right: 0, bottom: 30, left: 40},
		values = [], 
		datas =[];

	d.data.forEach( (d) => {
		values.push(d[1]);
		datas.push({
			value: d[1],
			date: moment(d[0]).format('MMM YYYY')
		});
	});

	colorScale = d3.scaleLinear()
					.domain([0, d3.max(values)])
					.range(['#ffb832', '#c61c6f']);

	tooltip = d3.select('body')
					.append('div')
					.style('position', 'absolute')
                  	.style('padding', '0 10px')
                  	.style('background', 'white')
                  	.style('opacity', 0);					

	xScale = d3.scaleBand()
				.domain(values)
				.padding(0)
				.range([0, width]);

	yScale = d3.scaleLinear()
				.domain([0, d3.max(values)])
				.range([0, height]);


	canvas = d3.select('#container').append('svg')
				.attr('width', width)
				.attr('height', height)
				.attr('fill', 'grey');

	rect = canvas.selectAll('rect')
					.data(datas)
					.enter()
						.append('rect')
						.attr('width', xScale.bandwidth())
						.attr('height', (d) => yScale(d.value))
						.attr('y', (d) => height - yScale(d.value))
						.attr('x', (d,i) => xScale(d.value))
						.attr('fill', (d) => colorScale(d.value))
						.on('mouseover', function(d) {
							tempColor = this.style.fill;

							tooltip.transition().duration(200)
								    .style('opacity', '0.9')

							tooltip.html( 
                                  `<div><span class="tooltip-line">$${d.value}B</span>
                                  <span class="tooltip-line">${d.date}</span></div>`
                              )
	                             .style('left', (d3.event.pageX + 2) + 'px')
	                             .style('top', (d3.event.pageY - 35) + 'px');

							 d3.select(this)
			                      .transition()
			                      .style('fill', 'green')
						})
						.on('mouseout', function(d) {
							d3.select(this)
				                      .transition()
				                      .style('fill', tempColor);
						});
});



