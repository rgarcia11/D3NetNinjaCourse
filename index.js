// select svg container first
const svg = d3.select('.canvas')
    .append('svg')
        .attr('width', 600)
        .attr('height', 600);

// create margins and dimensions for the graph area
const margin = {top: 20, right: 20, bottom: 100, left: 100 };
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// create axis groups
const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

// create y and x scale functions
const y = d3.scaleLinear()
    .range([graphHeight, 0]);

const x = d3.scaleBand()
    .range([0, 500])
    .paddingInner(0.2)
    .paddingOuter(0.2);

// create and call the axis
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y)
    .ticks(4)
    .tickFormat(d => `${d} orders`);    

// update x axis text angle
xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    .attr('fill', 'orange');

// update function
const update = data => {

    // 1. update scales (domains)
    y.domain([0, d3.max(data, d => d.orders)]);
    x.domain(data.map( item => item.name ));

    // 2. join updated data to elements
    const rects = graph.selectAll('rect')
        .data(data);

    // 3. remove exit selection
    rects.exit().remove();

    // 4. update current shapes in the dom
    rects.attr('width', x.bandwidth)
        .attr('height', d => graphHeight - y(d.orders))
        .attr('fill', 'orange')
        .attr('x', d => x(d.name))
        .attr('y', d => y(d.orders));

    // 5. append the enter selection to the dom
    rects.enter()
        .append('rect')
            .attr('width', x.bandwidth)
            .attr('height', d => graphHeight - y(d.orders))
            .attr('fill', 'orange')
            .attr('x', d => x(d.name))
            .attr('y', d => y(d.orders));

    // 6. Other elements that need to be displayed
    // Call Axis
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

}

db.collection('dishes').get().then( res => {

    var data = [];
    res.docs.forEach(doc => {
        data.push(doc.data());
    });

    d3.interval(() => {
        data[0].orders += 50;
        update(data);
    }, 1000);
    
});
