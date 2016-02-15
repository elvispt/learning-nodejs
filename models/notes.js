var mysql = require('mysql'),
    cfgDB = require('../config/db'),
    Q = require('q'),
    util = require('util');

var connection = mysql.createConnection(cfgDB.connectionConfig);

var notes = {
    create: create,
    read: read,
    update: update,
    delete: del
};

function create(note, tagId) {
    connection.query('INSERT INTO note(note) VALUES(?)', [note], function (err, results) {
        if (err) {
            throw err;
        }
        return results;
    });
}

function read(id) {
    var deferred = Q.defer(),
        query = 'SELECT * FROM note';

    if (id) {
        query += ' WHERE id = ?';
    }
    connection.query(query, [id], function (err, results) {
        if (err) {
            //throw err;
            deferred.reject('error!!!');
        }
        deferred.resolve(results);
        return results;
    });
    return deferred.promise;
}

function update(note, tagId) {
    connection.query('UPDATE note SET note = ?', [note], function (err, results) {
        if (err) {
            throw err;
        }
        return results;
    });
}

function del(id) {
    var deferred = Q.defer();

    if (!id) {
        deferred.reject('No ID provided');
    }
    connection.query('DELETE FROM note WHERE id = ?', [id], function (err, results) {
        if (err) {
            //throw err;
            deferred.reject('error!!!');
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

module.exports = notes;