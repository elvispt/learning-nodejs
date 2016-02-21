var mysql = require('mysql'),
    cfgDB = require('../config/db'),
    Q = require('q'),
    util = require('util');

var connection = mysql.createConnection(cfgDB.connectionConfig);

var notes = {
    create: create,
    read: read,
    update: update,
    del: del
};

function create(note, tagId) {
    connection.query('INSERT INTO note(note, creationTime, lastModification) VALUES(?, now(), now())', [note], function (err, results) {
        if (err) {
            //throw err;
            console.log(err);
            reject('ERROR!');
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
            console.log(err);
            //throw err;
            deferred.reject('error!!!');
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

function update(id, note, tagId) {
    var deferred = Q.defer();

    connection.query('UPDATE note SET note = ? WHERE id = ?', [note, id], function (err, results) {
        if (err) {
            //throw err;
            console.log(err);
            deferred.reject('error!!!');
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

function del(id) {
    var deferred = Q.defer();

    if (!id) {
        deferred.reject('No ID provided');
    }
    connection.query('DELETE FROM note WHERE id = ?', [id], function (err, results) {
        if (err) {
            //throw err;
            console.log(err);
            deferred.reject('error!!!');
        }
        deferred.resolve(results);
    });
    return deferred.promise;
}

module.exports = notes;
