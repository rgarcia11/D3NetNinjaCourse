const dims = { height: 500, width: 1100 };

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 100)
    .attr('height', dims.height + 100);

const graph = svg.append('g')
    .attr('transform', `translate(50, 50)`);

// data strat and tree!
const stratify = d3.stratify()
    .id(d => d.name)
    .parentId(d => d.parent);

const tree = d3.tree()
    .size([dims.width, dims.height]);

// color scale
const colour = d3.scaleOrdinal(['#f48fb1', '#ff1744', '#8c9eff', '#80deea']);

// update function!
const update = data => {

    graph.selectAll('.node').remove();
    graph.selectAll('.link').remove();

    // Scale domains
    colour.domain(data.map(item => item.department));

    // Link data
    const rootNode = stratify(data);
    const treeData = tree(rootNode);
    const nodes = graph.selectAll('.node')
        .data(treeData.descendants())
    
    const links = graph.selectAll('.links')
        .data(treeData.links());
    
    // Exit selection

    // Current selection

    // Enter selection
    links.enter()
        .append('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', '#aaa')
        .attr('stroke-width', 2)
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y));
    
    const enterNodes = nodes.enter()
        .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

    enterNodes.append('rect')
        .attr('fill', d => colour(d.data.department))
        .attr('stroke', '#555')
        .attr('stroke-width', 2)
        .attr('height', 50)
        .attr('width', d => d.data.name.length * 20)
        .attr('transform', d => `translate(${-d.data.name.length*10}, -31)`);

    enterNodes.append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(d => d.data.name);

    // Other elements
};

let data = [];

db.collection('members').onSnapshot(res => {

    res.docChanges().forEach(change => {

        const doc = { ...change.doc.data(), id: change.doc.id };

        const switchOnChangeType = {
            added: () => [...data, doc],
            modified: () => [...data.filter(item => item.id !== doc.id), doc],
            removed: () => data.filter(item => item.id !== doc.id)
        }

        data = switchOnChangeType[change.type]() || data;

    });

    update(data);

});