var util = require('util'),
    notesModel = require('../models/notes'),
    _ = require('lodash'),
    moment = require('moment');

var notes = {
    list: list,
    viewNote: viewNote,
    showForm: showForm,
    editNote: editNote,
    updateNote: updateNote,
    createNote: createNote
};

var layout = 'layout-notes';

function render(res, view, options) {
    var numNotes = notesModel.count();

    notesModel.count().then(function (response) {
        res.render(view, _.extend({}, options, {
            numNotes: response[0].numNotes,
            layout: 'layout-notes'
        }));
    });
}

function list(req, res) {
    var notes = notesModel.read().then(function (response) {
        render(res, 'notes', {
            title: 'List of notes',
            notes: response
        });
    });
}

function showForm(req, res) {
    render(res, 'edit-note', {
        title: 'Create Note',
        current: 'notes'
    });
}

function viewNote(req, res) {
    var noteId = req.params.noteId;

    if (noteId) {
        notesModel.read(noteId).then(function (response) {
            var note,
                format = 'YYYY-MM-DD HH:mm:ss';

            note = _.extend({}, response[0], {
                creationTime: moment(response[0].creationTime).format(format),
                lastModification: moment(response[0].lastModification).format(format)
            });

            render(res, 'view-note', {
                note: note
            });
        });
    }
}

function createNote(req, res) {
    var noteTitle = req.body.noteTitle || '',
        noteText = req.body.notetxt || '';

    if (noteText) {
        notesModel.create(noteTitle, noteText);
    }
    res.redirect('/notes');
}

function editNote(req, res) {
    var noteId = req.body.noteId;

    if (req.body.editBtn && noteId) {
        notesModel.read(noteId).then(function (response) {
            render(res, 'edit-note', {
                title: 'Edit note',
                note: response[0]
            });
        });
    } else if (req.body.deleteBtn) {
        try {
            notesModel.del(noteId).then(
                function (response) {
                    console.log(response);
                    res.redirect('/notes');
                },
                function (response) {
                    console.error(response);
                    res.redirect('/notes');
                }
            );
        } catch (e) {
            console.error(e);
        }
    } else {
        res.redirect('/notes');
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
