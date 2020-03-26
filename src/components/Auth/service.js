require('dotenv').config();
const jwt = require('jsonwebtoken');
const UserModel = require('./model');
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
 * @method create
 * @param {object} profile
 * @summary create a new user
 * @returns {Promise<UserModel>}
 */
function create(profile) {
    return UserModel.create(profile);
}

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


module.exports = {
    findByEmail,
    findAll,
    create,
    generateAccessToken,
    generateRefreshToken,
    decode,
};
