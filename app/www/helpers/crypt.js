'use strict';

var Bcrypt = require('bcrypt');
var Crypto = require('crypto');
var uuid = require('uuid');
var Config = require('config');

var settings = {
    algo: 'AES-256-CBC',
    secret: Config.appSecret || 'sdfsrfoi234092SDFSDFSas;dof;yut#@!ER23er2&^%$32a'
};


exports.generateAPIkey = function (substringCnt) {
    var key = Crypto.createHash('sha256').update(uuid.v4()).update('salasfadsfwewfwsdf34234t').digest('hex');

    if (substringCnt) {
        key = key.substring(0, substringCnt);
    }

    return key;
};

/***
 * get a random string
 * @param len:<optional>: default is 32
 * @returns promise->(string)
 */
exports.randomString = function (len) {
    return new Promise(function (resolve, reject) {

        Crypto.randomBytes(len || 32, function (ex, buf) {
            if (ex) {
                return reject(ex);
            }

            resolve(buf.toString('base64'));
        });
    });
};

/***
 * Create bcrypt hash for a string
 * @param str:<required>: string to hash
 * @returns promise->(string)
 */
exports.genHash = function (str) {
    return new Promise(function (resolve, reject) {

        if (!str) {
            return reject('Missing one of required param');
        }

        if (typeof str !== 'string') {
            return reject('Invalid param type');
        }

        exports
            .genSalt()
            .then(function (salt) {
                Bcrypt.hash(str, salt, function (err, hash) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(hash);
                });
            })
            .catch(reject);
    });
};


/***
 * generate a bcrypt salt
 * @returns promise->(string)
 */
exports.genSalt = function () {

    return new Promise(function (resolve, reject) {
        Bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return reject(err);
            }
            resolve(salt);
        });
    });
};


/***
 * compare a string with hash
 * @param str:<required>: to compare with old hash
 * @param hash:<required>: old hashed string
 * @returns promise->(boolean)
 */
exports.compareHash = function (str, hash) {
    return new Promise(function (resolve, reject) {

        if (!str || !hash) {
            return reject('Missing one of required param');
        }

        if (typeof str !== 'string' || typeof hash !== 'string') {
            return reject('Invalid param type');
        }

        Bcrypt.compare(str, hash, function (err, isMatch) {
            if (err) {
                return reject(err);
            }
            resolve(isMatch);
        });
    });

};


/***
 * encrypt a string
 * @param text:<required>: string to encrypt.
 * @param secret:<optional>: secret to encrypt string with. Default is local lib secret
 * @returns promise->(string)
 */
exports.encrypt = function (text, secret) {

    return new Promise(function (resolve, reject) {

        secret = secret || settings.secret;

        if (!text) {
            return reject('Missing one of required param');
        }

        if (typeof text !== 'string' || typeof secret !== 'string') {
            return reject('Invalid param type');
        }

        var cipher = Crypto.createCipher(settings.algo, secret);
        var crypted = cipher.update(text, 'utf8', 'base64') + cipher.final('base64');

        resolve(crypted);
    });
};


/***
 * decrypt a string
 * @param text:<required>: string to decrypt
 * @param secret:<optional>: secret used to encrypt. Default is local lib secret
 * @returns {*}
 */
exports.decrypt = function (text, secret) {

    return new Promise(function (resolve, reject) {

        secret = secret || settings.secret;

        if (!text) {
            return reject('Missing one of required param');
        }

        if (typeof text !== 'string' || typeof secret !== 'string') {
            return reject('Invalid param type');
        }

        var decipher = Crypto.createDecipher(settings.algo, secret);
        var decrypted = decipher.update(text, 'base64', 'utf8') + decipher.final('utf8');

        resolve(decrypted);
    });
};


/***
 * It encrypt an object to a string
 * @param obj:<required>: to encrypt
 * @param secret:<optional>: to encrypt with. Default is local lib secret
 * @returns promise->(string)
 */
exports.encryptObject = function (obj, secret) {

    return new Promise(function (resolve, reject) {

        if (!obj) {
            return reject('Missing one of required param');
        }

        exports
            .encrypt(JSON.stringify(obj), secret)
            .then(resolve)
            .catch(reject);
    });
};


/***
 * Decrypt object from a string
 * @param text:<required>: old encrypted object string
 * @param secret:<optional>: secret used to encrypt. Default is local lib secret
 * @returns promise->(object)
 */
exports.decryptObject = function (text, secret) {
    return new Promise(function (resolve, reject) {

        if (!text) {
            return reject('Missing one of required param');
        }

        exports
            .decrypt(text, secret)
            .then(function (decStr) {
                resolve(JSON.parse(decStr));
            })
            .catch(reject);
    });
};
