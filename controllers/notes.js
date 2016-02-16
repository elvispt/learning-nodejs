var util = require('util'),
    notesModel = require('../models/notes');

var vd = function (v) {
    return util.inspect(v, { colors: true });
};

var notes = {
    list: list,
    showForm: showForm,
    editNote: editNote,
    updateNote: updateNote,
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
            notesModel.del(noteId).then(function (response) {
                console.log(response);
                res.redirect('/notes');
            },
            function (response) {
                console.error(response);
            });
        } catch (e) {
            console.error(e);
        }
    }
}

function editNote(req, res, next) {
    var noteId = req.body.noteId;

    if (noteId) {
        notesModel.read(noteId).then(function (response) {
            res.render('edit-note', {
                title: 'EDIT NOTE HERE',
                note: response[0]
            });
        });
    }
}

function updateNote(req, res, next) {
    var noteId = req.body.noteId,
        note = req.body.notetxt;

    if (noteId && note) {
        notesModel.update(noteId, note).then(function (response) {
            console.log(response);
            res.redirect('/notes');
        });
    }
}

module.exports = notes;
