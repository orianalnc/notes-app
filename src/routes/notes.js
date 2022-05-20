const express = require('express');
const router = express.Router();

const Note = require('../models/Note');

const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {

    const { title, description } = req.body;
    const errors = [];
    if (!title) {
        errors.push({ text: 'Ingresa un titulo' })
    }
    if (!description && description <= 0) {
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
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Nota agregada exitosamente');
        res.redirect('/notes');
    }

});

router.get('/notes', isAuthenticated, async (req, res) => {
   const notes = await Note.find({user: req.user.id}).sort({ date: 'desc' }).lean();
    res.render('notes/all-notes', { notes: notes });

}); 


router.get('/notes/edit/:id', isAuthenticated, async (req, res) =>{
   const note = await Note.findById(req.params.id).lean();
   if (note.user != req.user.id) {
    req.flash("error", "No autorizado");
    return res.redirect("/notes");
  }
  res.render("notes/edit-note", { note });
   // res.render('notes/edit-note', {note})
});


router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const { title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Nota actualizada exitosamente');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
   await Note.findByIdAndDelete(req.params.id);
   req.flash('success_msg', 'Nota eliminada');
   res.redirect('/notes');

});

/*
router.get('/notes',  (_req, res) => {
    Note.find().lean().then(notes => res.render('notes/all-notes', { notes: notes}));
});*/


module.exports = router;