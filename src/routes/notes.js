const express = require('express');
const router = express.Router();

const Note = require('../models/Note');

router.get('/notes/add', (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', async (req, res) => {

    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Ingresa un titulo' })
    }
    if (!description) {
        errors.push({ text: 'Ingresa una descripción' })
    }
    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        })
    }
    else {
        const newNote = new Note({ title, description });
        await newNote.save();
        req.flash('success_msg', 'Nota agregada exitosamente');
        res.redirect('/notes');
    }

});

router.get('/notes', async (req, res) => {
   const notes = await Note.find().lean().sort({ date: 'desc' });
    res.render('notes/all-notes', { notes: notes });

}); 


router.get('/notes/edit/:id',  async (req, res) =>{
   const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note', {note})
});


router.put('/notes/edit-note/:id', async (req, res) => {
    const { title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Nota actualizada exitosamente');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', async (req, res) => {
   await Note.findByIdAndDelete(req.params.id);
   req.flash('success_msg', 'Nota eliminada');
   res.redirect('/notes');

});

/*
router.get('/notes',  (_req, res) => {
    Note.find().lean().then(notes => res.render('notes/all-notes', { notes: notes}));
});*/


module.exports = router;