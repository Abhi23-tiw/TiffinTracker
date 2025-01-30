const bcrypt = require('bcrypt')


// hashing

exports.hashPassword = (password) => {
    return new Promise((resolve , reject) => {
        bcrypt.genSalt(10 , (err , salt) => {
            if (err) {
                reject(err)
            }
            bcrypt.hash(password , salt , (err , hash) => {
                if (err) {
                    reject(err)
                }
                resolve(hash)
            });
        });
    });
}


// dcrypt password || 
exports.comparePassword = (password , hashed) => {
    return bcrypt.compare(password , hashed);
}