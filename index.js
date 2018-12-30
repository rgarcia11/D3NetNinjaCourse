const modal = document.querySelector('.modal');
M.Modal.init(modal);

const form = document.querySelector('form');
const name = document.querySelector('#name');
const parent = document.querySelector('#parent');
const department = document.querySelector('#department');

form.addEventListener('submit', e => {
    e.preventDefault();

    
    db.collection('members').add({
        name: name.value,
        parent: parent.value,
        department: department.value
    }).then(() => {
        form.reset();
        const modalInstance = M.Modal.getInstance(modal);
        modalInstance.close();
    })
    
});
db.collection('members');
