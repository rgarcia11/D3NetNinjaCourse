const margin = { top: 40, right: 20, bottom: 50, left: 100 };
const svgDims = { width: 560, height: 400 };
const graphWidth = svgDims.width - margin.right - margin.left;
const graphHeight = svgDims.height - margin.top - margin.bottom;

const svg = d3.selectAll('.canvas')
    .append('svg')
    .attr('width', svgDims.width)
    .attr('height', svgDims.height);

const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const x = d3.scaleTime()
    .range([0, graphWidth]);

const y = d3.scaleLinear()
    .range([graphHeight, 0]);

xAxisGroup = graph.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${graphHeight})`);
yAxisGroup = graph.append('g')
    .attr('class', 'y-axis');


const xAxis = d3.axisBottom(x)
    .ticks(4)
    .tickFormat(d3.timeFormat('%d %b %H:%m'));
const yAxis = d3.axisLeft(y)
    .ticks(4)
    .tickFormat(d => `${d}m`);

const line = d3.line()
    .x(d => x(new Date(d.date)))
    .y(d => y(d.distance));

const path = graph.append('path');

const hoverCrossGroup = graph.append('g')
    .attr('class', 'lines')
    .style('opacity', 0);
const yHoverCross = hoverCrossGroup.append('line')
    .style('stroke-dasharray', 4)
    .attr('stroke', '#ffffff');
const xHoverCross = hoverCrossGroup.append('line')
    .style('stroke-dasharray', 4)
    .attr('stroke', '#ffffff');

const update = data => {

    // 1. scale domains and axis
    x.domain(d3.extent(data, d => new Date(d.date)));
    y.domain([0, d3.max(data, d => d.distance)]);

    // 2. Filter, sort and link data
    data = data.filter(item => item.activity === activity);
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
    const circles = graph.selectAll('circle')
        .data(data);

    // 3. exit selection
    circles.exit().remove();

    // 4. current selection
    circles.attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => y(d.distance));

    // 5. enter selection
    circles.enter()
        .append('circle')
            .attr('cx', d => x(new Date(d.date)))
            .attr('cy', d => y(d.distance))
            .attr('r', 5)
            .attr('fill', '#ffeb3b');

    // Animations
    graph.selectAll('circle')
        .on('mouseover', (d, i, n) => {
            d3.select(n[i])
                .transition().duration(150)
                    .attr('r', 7)
                    .attr('fill', '#ffffff');
                    
            yHoverCross
                .attr('x1', 0)
                .attr('x2', x(new Date(d.date)))
                .attr('y1', y(d.distance))
                .attr('y2', y(d.distance));

            xHoverCross
                .attr('x1', x(new Date(d.date)))
                .attr('x2', x(new Date(d.date)))
                .attr('y1', y(d.distance))
                .attr('y2', graphHeight);

            hoverCrossGroup.transition().duration(150)
                .style('opacity', 1);
        })
        .on('mouseleave', (d, i, n) => {
            d3.select(n[i])
                .transition().duration(150)
                    .attr('r', 5)
                    .attr('fill', '#ffeb3b');
            hoverCrossGroup.transition().duration(150)
                .style('opacity', 0);
        });

    // 6. Other elements
    // Axis
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
    xAxisGroup.selectAll('text')
        .attr('transform', `rotate(-40)`)
        .attr('text-anchor', `end`);

    // Update path data
    path.data([data])
        .attr('fill', 'none')
        .attr('stroke', '#ffeb3b')
        .attr('stroke-width', 2)
        .attr('d', line);
};

// data and firestore
let data = [];

db.collection('activities').onSnapshot(res => {
    
    res.docChanges().forEach(change => {

        const doc = {...change.doc.data(), id: change.doc.id };

        const switchOnChangeType = {
            added: () => [...data, doc],
            modified: () => [...data.filter(item => item.id !== doc.id), doc],
            removed: () => data.filter(item => item.id !== doc.id)
        }

        data = switchOnChangeType[change.type]() || data;

    });

    update(data);

});

const dateMaxAndMin = () => {
    const dates = data.map(d => new Date(d.date));
    return [Math.min(dates), Math.max(dates)];
};
