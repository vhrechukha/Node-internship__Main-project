const { Router } = require('express');

const csrf = require('csurf');

const UserComponent = require('../User');

const csrfProtection = csrf({ cookie: true });

const isAuth = require('../../polices/isAuthPassport');

/**
 * Express router to mount user related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * Route serving list of users.
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/', csrfProtection, isAuth.checkAuthenticated, UserComponent.findAll);

/**
 * Route which open forms register/login for user
 * @name /v1/users/login
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/login', csrfProtection, isAuth.checkNotAuthenticated, UserComponent.logIn);

/**
 * Route which open forms register/login for user
 * @name /v1/users/signUp
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/signUp', csrfProtection, isAuth.checkNotAuthenticated, UserComponent.signUp);

/**
 * Route register for user.
 * @name /v1/users/register
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/register', csrfProtection, isAuth.checkNotAuthenticated, UserComponent.register);

/**
 * Route login for user.
 * @name /v1/users/login
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/login', csrfProtection, isAuth.checkNotAuthenticated, UserComponent.login);

/**
 * Route logout for user.
 * @name /v1/users/logout
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/logout', csrfProtection, isAuth.checkAuthenticated, UserComponent.logout);

module.exports = router;
