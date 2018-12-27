const dims = { height: 300, width: 300, radius: 150 };
const cent = { x: (dims.width / 2 + 5), y: (dims.height / 2 + 5)}

const svg = d3.selectAll('.canvas')
    .append('svg')
    .attr('width', dims.width + 150)
    .attr('height', dims.height + 150);

const graph = svg.append('g')
    .attr('transform', `translate(${cent.x}, ${cent.y})`);

const pie = d3.pie()
    .sort(null)
    .value(d => d.cost);

const angles = pie([
    { name: 'rent', cost: 500 },
    { name: 'bills', cost: 300 },
    { name: 'gaming', cost: 200 }
]);

const arcPath = d3.arc()
    .outerRadius(dims.radius)
    .innerRadius(dims.radius / 2);

const colour = d3.scaleOrdinal(d3['schemeSet3']);

const legendGroup = svg.append('g')
    .attr('transform', `translate(${dims.width + 40}, 10)`);

const legend = d3.legendColor()
    .shape('circle')
    .shapePadding(20)
    .scale(colour);

const update = data => {

    colour.domain(data.map(d => d.name));

    const paths = graph.selectAll('path')
        .data(pie(data));

    paths.exit()
        .transition().duration(600)
            .attrTween('d', arcTweenExit)
        .remove();

    paths.attr('d', arcPath)
        .transition().duration(600)
            .attrTween('d', arcTweenUpdate);

    paths.enter()
        .append('path')
        .attr('class', 'arc')
        .attr('d', arcPath)
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.75)
        .attr('fill', d => colour(d.data.name))
        .each(function(d){ this._current = d })
        .transition().duration(600)
            .attrTween('d', arcTweenEnter);

    graph.selectAll('path')
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .on('click', handleMouseClick);

    legendGroup.call(legend);
    legendGroup.selectAll('text').attr('fill', 'white');
}

let data = [];

db.collection('expenses').onSnapshot(res => {

    res.docChanges().forEach(change => {

        const doc = {...change.doc.data(), id: change.doc.id};

        switch (change.type) {
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id);
                break;
            default:
                break;
        }

    });

    update(data);

});

const arcTweenEnter = d => {
    let i = d3.interpolate(d.endAngle, d.startAngle);

    return t => {
        d.startAngle = i(t);
        return arcPath(d);
    };
};

const arcTweenExit = d => {
    let i = d3.interpolate(d.startAngle, d.endAngle);

    return t => {
        d.startAngle = i(t);
        return arcPath(d);
    };
};

function arcTweenUpdate(d){
    let i = d3.interpolate(this._current, d);
    this._current = d;

    return t => {
        return arcPath(i(t));
    };
}

const handleMouseOver = (d, i, n) => {
    d3.select(n[i])
        .transition('changeSliceFill').duration(300)
            .attr('fill', '#e0f2f1');
};

const handleMouseOut = (d, i, n) => {
    d3.select(n[i])
        .transition('changeSliceFill').duration(300)
            .attr('fill', colour(d.data.name));
};

const handleMouseClick = d => {
    db.collection('expenses').doc(d.data.id).delete()
};
