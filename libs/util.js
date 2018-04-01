'use strict';
const Promise = require('promise');
const fs = require('fs');
exports.readFileAsync = function(fpath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(fpath, function(err, data) {
            if (err) reject(err);
            else resolve(data.toString());
        })
    })
}
exports.writeFileAysnc = function(fpath, content) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(fpath, content, function(err) {
            if (err) reject(err);
            else resolve();
        })
    })
}