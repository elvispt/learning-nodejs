var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '192.168.1.100',
    user     : 'nodejs',
    password : '',
    database : 'nodejscon'
});

connection.connect();

connection.query('SELECT * from testingTable AS xxx', function(err, rows, fields) {
    if (err) {
        throw err;
    }
    rows.forEach(function (value) {
        console.log(value.id + ' - ' + value.txt);
    });
});