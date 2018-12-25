const data = [
    {width: 200, height: 100, fill: 'purple'},
    {width: 100, height: 60, fill: 'pink'},
    {width: 50, height: 30, fill: 'red'}
];

const svg = d3.select('svg');

const rect = svg.selectAll('rect')
    .data(data)                     // join data
    .attr('width', d => d.width)    // attrs to rects already in the DOM
    .attr('height', d => d.height)
    .attr('fill', d => d.fill)
    .enter()                        // virtual rects
    .append('rect')                 // add rects
    .attr('width', d => d.width)    // attrs to new rects
    .attr('height', d => d.height)
    .attr('fill', d => d.fill);