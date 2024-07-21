const userRepository = require('../dataAccess/userRepository')
const bcrypt = require('bcrypt');
const recipeRepository = require("../dataAccess/recipeRepository");

async function registerNewUser(data) {
    data.password = await hashPassword(data.password)
    const insertedUserId = await userRepository
        .checkUserExistsByEmail(data.email).then(async isExist => {
            if (isExist) {
                throw new Error('User already exists!');
            } else {
                console.log('User does not exist.');
                return await userRepository.createUser(data).then(r => {
                    console.log(r)
                    return r.insertId;
                });
            }
        })
        .catch(error => {
            throw new Error(error.message);
        });
    const user = await userRepository.getUserById(insertedUserId);
    return user[0]
}

async function hashPassword(password) {
    const saltRounds = 10;
    return await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })
}

async function comparePassword(passwordFromUser, passwordFromDb) {
    return await new Promise((resolve, reject) => {
        bcrypt.compare(passwordFromUser, passwordFromDb, function (err, result) {
            if (err) reject(err)
            resolve(result)
        })
    })
}

async function login(data) {
    let shortUserData = await userRepository
        .getUserByEmail(data.email)
        .then(userData => {
            console.log(userData)
            if (userData === 0 || userData == null) {
                throw new Error('Wrong email or password!');
            }
            return userData

        })
        .catch(error => {
            throw new Error(error.message);
        });
    let result = await comparePassword(data.password, shortUserData[0].password);
    if (result) {
        return shortUserData[0]
    } else {
        throw new Error("Wrong password")
    }
}


module.exports = {
    registerNewUser,
    login,
}