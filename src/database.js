const mongosse = require('mongoose');

mongosse.connect('mongodb://localhost/notes-bd-app')
        .then(() => {
             console.log('BD conectada!');
        })
        .catch(err => console.error(err))