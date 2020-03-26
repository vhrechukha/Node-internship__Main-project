const { Router } = require('express');

const csrf = require('csurf');

const UserComponent = require('../Auth');

const csrfProtection = csrf({ cookie: true });

const isAuth = require('../../polices/isAuthPassport');
const isAuthJwt = require('../../polices/isAuth');

/**
 * Express router to mount user related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * PASSPORT route register for user.
 * @name /v1/users/register
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/register', csrfProtection, isAuth.checkNotAuthenticated, UserComponent.registerPassport);

/**
 * PSSPORT route login for user.
 * @name /v1/users/login
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/login', csrfProtection, isAuth.checkNotAuthenticated, UserComponent.loginPassport);

/**
 * PASSPORT route logout for user.
 * @name /v1/users/logout
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/logout', csrfProtection, isAuth.checkAuthenticated, UserComponent.logoutPassport);

/**
 * JWT route which create new user.
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/createJWT', UserComponent.createJwt);

/**
 * JWT route for login user.
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/loginJWT', UserComponent.loginJwt);

/**
 * JWT route for logout user.
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/logoutJWT', isAuthJwt, UserComponent.logoutJwt);

/**
 * JWT route for continiue session.
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/continuationsession', isAuthJwt, UserComponent.updateConnectionJwt);

module.exports = router;
