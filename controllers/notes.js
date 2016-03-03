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
    notesModel.count().then(function (response) {
        res.render(view, _.extend(options, {
            numNotes: response[0].numNotes,
            layout: 'layout-notes'
        }));
    });
}

function list(req, res) {
    notesModel.read().then(
        function (response) {
            var notesList = [];

            response.forEach(function (note) {
                var data;
                try {
                    data = JSON.parse(note.note);
                } catch (e) {
                    data = {};
                }
                data = data.data;

                var item = data[0];
                notesList.push(_.extend({}, note, {
                    note: item.data.text || ''
                }));
            });


            render(res, 'notes', {
                title: 'List of notes',
                notes: notesList
            });
        },
        function (response) {
            console.error(response);
        }
    );
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
    var noteId = req.params.noteId;

    notesModel.read(noteId).then(function (response) {
        render(res, 'edit-note', {
            title: 'Edit note',
            note: response[0]
        });
    });

    //if (req.body.editBtn && noteId) {
    //    notesModel.read(noteId).then(function (response) {
    //        render(res, 'edit-note', {
    //            title: 'Edit note',
    //            note: response[0]
    //        });
    //    });
    //} else if (req.body.deleteBtn) {
    //    try {
    //        notesModel.del(noteId).then(
    //            function (response) {
    //                console.log(response);
    //                res.redirect('/notes');
    //            },
    //            function (response) {
    //                console.error(response);
    //                res.redirect('/notes');
    //            }
    //        );
    //    } catch (e) {
    //        console.error(e);
    //    }
    //} else {
    //    res.redirect('/notes');
    //}
}

function updateNote(req, res, next) {
    var noteId = req.body.noteId,
        noteTitle = req.body.noteTitle,
        note = req.body.notetxt;

    if (noteId && note) {

        if (req.body.updateNote) {
            notesModel.update(noteId, noteTitle, note).then(function (response) {
                console.log(response);
                res.redirect('/notes');
            });
        } else {
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
        }
    }
}

module.exports = notes;
