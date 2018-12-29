const dims = { height: 500, width: 1100 };

const svg = d3.select('.canvas')
    .append('svg')
    .width('width', dims.width + 100)
    .height('height', dims.height + 100);

const graph = svg.append('g')
    .attr('transform', `translate(50, 50)`);

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

    console.log(data);

});