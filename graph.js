const dims = { height: 500, width: 1100 };

const svg = d3.select('.canvas')
    .append('svg')
    .width('width', dims.width + 100)
    .height('height', dims.height + 100);

const graph = svg.append('g')
    .attr('transform', `translate(50, 50)`);

// data strat and tree!
const stratify = d3.stratify()
    .id(d => d.name)
    .parentId(d => d.parent);

const tree = d3.tree()
    .size([dims.width, dims.height]);

// update function!
const update = data => {
    // Scale domains

    // Link data
    const rootNode = stratify(data);
    const treeData = tree(rootNode);
    const nodes = graph.selectAll('.node')
        .data(treeData.descendants())
    
    // Exit selection

    // Current selection

    // Enter selection

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