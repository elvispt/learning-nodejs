var util = require('util'),
    notesModel = require('../models/notes'),
    _ = require('lodash');

var notes = {
    list: list,
    viewNote: viewNote,
    showForm: showForm,
    editNote: editNote,
    updateNote: updateNote,
    createNote: createNote,
    deleteNote: deleteNote
};

var layout = 'layout-notes';

function render(res, view, options) {
    res.render(view, _.extend({}, options, {
        layout: 'layout-notes'
    }));
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
    render(res, 'create-note', {
        title: 'CREATE NOTE HERE',
        current: 'notes'
    });
}

function viewNote(req, res) {
    var noteId = req.params.noteId;

    if (noteId) {
        notesModel.read(noteId).then(function (response) {
            render(res, 'view-note', {
                note: response[0]
            });
        });
    }
}

function createNote(req, res) {
    var noteText = req.body.notetxt || '';

    if (noteText) {
        notesModel.create(noteText);
    }
    res.redirect('/notes');
}

function deleteNote(req, res) {
    var noteIdList = req.body.noteId;

    noteIdList = Array.isArray(noteIdList) ? noteIdList : [noteIdList];
    noteIdList.forEach(function (noteId) {
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
    });
}

function editNote(req, res) {
    var noteId = req.body.noteId;

    if (noteId) {
        notesModel.read(noteId).then(function (response) {
            render(res, 'edit-note', {
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
