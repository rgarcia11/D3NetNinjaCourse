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