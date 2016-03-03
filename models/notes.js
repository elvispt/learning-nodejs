var mysql = require('mysql'),
    cfgDB = require('../config/db'),
    Q = require('q'),
    util = require('util');

var connection = mysql.createConnection(cfgDB.connectionConfig);

var notes = {
    create: create,
    read: read,
    update: update,
    del: del,
    count: count
};

function create(title, note, tagId) {
    var deferred = Q.defer(),
        query = 'INSERT INTO note(title, note, creationTime, lastModification) VALUES(?, ?, now(), now())';

    connection.query(query, [title, note], function (err, results) {
        if (err) {
            //throw err;
            console.log(err);
            deferred.reject('error!!!');
        }
        deferred.resolve(results);
        return results;
    });
    return deferred.promise;
}

function read(id) {
    var deferred = Q.defer(),
        query = 'SELECT * FROM note';

    if (id) {
        query += ' WHERE id = ?';
    }
    try {
        connection.query(query, [id], function (err, results) {
            if (err) {
                console.log(err);
                //throw err;
                deferred.reject('error!!!');
            }
            deferred.resolve(results);
        });
    } catch (e) {
        console.error(e);
    }
    return deferred.promise;
}

function update(id, noteTitle, note, tagId) {
    var deferred = Q.defer();

    connection.query('UPDATE note SET title = ?, note = ? WHERE id = ?', [noteTitle, note, id], function (err, results) {
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

function count() {
    var deferred = Q.defer(),
        query = 'SELECT count(id) as numNotes FROM note';

    connection.query(query, function (err, results) {
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
