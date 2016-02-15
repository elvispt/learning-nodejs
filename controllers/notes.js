var util = require('util'),
    notesModel = require('../models/notes');

var vd = function (v) {
    util.inspect(v, { colors: true });
};

var notes = {
    list: list,
    showForm: showForm,
    createNote: createNote,
    deleteNote: deleteNote
};

function list(req, res, nex) {
    var notes = notesModel.read().then(function (response) {
        res.render('notes', {
            title: 'List of notes',
            notes: response
        });
    });
}

function showForm(req, res, next) {
    res.render('create-note', {
        title: 'CREATE NOTE HERE'
    });
}

function createNote(req, res, next) {
    var noteText = req.body.notetxt || '';

    if (noteText) {
        notesModel.create(noteText);
    }
    res.redirect('/notes');
}

function deleteNote(req, res, next) {
    var noteId = req.body.noteId;

    if (noteId) {
        try {
            notesModel.delete(noteId).then(function (response) {
                console.log(response);
                res.redirect('/notes');
            });
        } catch (e) {
            console.error(e);
        }

    }
}

module.exports = notes;
