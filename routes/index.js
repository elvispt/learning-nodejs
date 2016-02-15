var express = require('express'),
    router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/express', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

module.exports = router;
