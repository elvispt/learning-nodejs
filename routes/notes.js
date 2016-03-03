var express = require('express'),
    util = require('util'),
    controller = require('../controllers/notes'),
    router = express.Router();

router.get('/', controller.list);
router.get('/create', controller.showForm);
router.get('/view/:noteId', controller.viewNote);
router.get('/edit/:noteId', controller.editNote);

router.post('/edit/note', controller.updateNote);
router.post('/create/note', controller.createNote);

module.exports = router;
