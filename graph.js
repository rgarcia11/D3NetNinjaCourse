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

const update = data => {

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
