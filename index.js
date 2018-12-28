const btns = document.querySelectorAll('button');
const form = document.querySelector('form');
const formAct = document.querySelector('form span');
const input = document.querySelector('input');
const label = document.querySelector('form label');
const error = document.querySelector('.error');

let activity = 'cycling';

btns.forEach(btn => {
    btn.addEventListener('click', e => {
        activity = e.target.dataset.activity;

        btns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        input.setAttribute('id', activity);
        label.htmlFor = activity;
        formAct.textContent = activity;
    });
});

form.addEventListener('submit', e => {
    e.preventDefault();

    const distance = parseInt(input.value);
    if(distance){
        db.collection('activities').add({
            distance,
            activity,
            date: new Date().toString()
        }).then(() => {
            input.value = '';
            error.textContent = '';
        });
    } else {
        error.textContent = 'Please enter a valid distance!';
    }
});