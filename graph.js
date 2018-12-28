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

const update = data => {
    x.domain(d3.extent(data, d => new Date(d.date)));
    y.domain([0, d3.max(data, d => d.distance)]);

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
    xAxisGroup.selectAll('text')
        .attr('transform', `rotate(-40)`)
        .attr('text-anchor', `end`);
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

        data = switchOnChangeType[change.type]() || state.data;

    });

    update(data);

});

const dateMaxAndMin = () => {
    const dates = data.map(d => new Date(d.date));
    return [Math.min(dates), Math.max(dates)];
};
