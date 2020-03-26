require('dotenv').config();
const jwt = require('jsonwebtoken');
const UserModel = require('./model');

/**
 * @exports
 * @method find
 * @param {string} profile
 * @summary get a user
 * @returns {Promise<StaffModel>}
 */
function findByEmail(profile) {
    return UserModel.findOne({ email: profile }).exec();
}

/**
 * @exports
 * @method create
 * @param {object} profile
 * @summary create a new user
 * @returns {Promise<StaffModel>}
 */
function create(profile) {
    return UserModel.create(profile);
}

/**
 * @exports
 * @method generateAccessToken
 * @param {object} userEmail
 * @summary generate access token
 * @returns {Promise<StaffModel>}
 */
function generateAccessToken(userEmail) {
    return jwt.sign({ id: userEmail, expiresIn: '60s' }, process.env.SECRETKEY);
}

/**
 * @exports
 * @method generateRefreshToken
 * @param {object} userEmail
 * @summary generate refresh token
 * @returns {Promise<StaffModel>}
 */
function generateRefreshToken(userEmail) {
    return jwt.sign({ id: userEmail, expiresIn: '7d' }, process.env.SECRETKEY);
}

/**
 * @exports
 * @method decode
 * @param {string} token
 * @summary decode token
 * @returns {Promise<void>}
 */
function decode(token) {
    return jwt.verify(token, process.env.SECRETKEY);
}

/**
 * @exports
 * @method findAll
 * @param {}
 * @summary get list of all users
 * @returns Promise<UserModel[]>
 */
function findAll() {
    return UserModel.find({}).exec();
}

/**
 * @exports
 * @method findById
 * @param {string} id
 * @summary get a user
 * @returns {Promise<UserModel>}
 */
function findById(id) {
    return UserModel.findById(id).exec();
}

/**
 * Find a user by id and update his profile
 * @exports
 * @method updateById
 * @param {string} _id
 * @param {object} newProfile
 * @summary update a user's profile
 * @returns {Promise<void>}
 */
function updateById(id, newProfile) {
    return UserModel.updateOne({ id }, newProfile).exec();
}

/**
 * @exports
 * @method deleteById
 * @param {string} _id
 * @summary delete a user from database
 * @returns {Promise<void>}
 */
function deleteById(_id) {
    return UserModel.deleteOne({ _id }).exec();
}

module.exports = {
    findByEmail,
    generateAccessToken,
    generateRefreshToken,
    decode,
    findAll,
    findById,
    create,
    updateById,
    deleteById,
};
