const { Router } = require('express');

const csrf = require('csurf');

const UserComponent = require('../User');

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
 * PASSPORT route serving list of users.
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/', csrfProtection, isAuth.checkAuthenticated, UserComponent.findAllPassport);

/**
 * PASSPORT route which open forms register/login for user
 * @name /v1/users/login
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/login', csrfProtection, isAuth.checkNotAuthenticated, UserComponent.logInPassport);

/**
 * PASSPORT route which open forms register/login for user
 * @name /v1/users/signUp
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.get('/signUp', csrfProtection, isAuth.checkNotAuthenticated, UserComponent.signUpPassport);

/**
 * Route serving a user
 * @name /v1/users/:id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/:id', csrfProtection, UserComponent.findByIdPassport);

/**
 * Route serving a new user
 * @name /v1/users/create
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/create', csrfProtection, UserComponent.createPassport);

/**
 * Route serving a new user
 * @name /v1/users/update
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.put('/update', csrfProtection, UserComponent.updateByIdPassport);

/**
 * Route serving a new user
 * @name /v1/users/delete
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.delete('/delete', csrfProtection, UserComponent.deleteByIdPassport);

/**
 * JWT route serving list of users.
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/all', isAuthJwt, UserComponent.findAllJwt);

/**
 * JWT route for find user by id.
 * @name /v1/users/:id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/Jwt/:id', isAuthJwt, UserComponent.findByIdJwt);

/**
 * JWT route for update user.
 * @name /v1/users/update
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.put('/updateJwt', isAuthJwt, UserComponent.updateByIdJwt);

/**
 * JWT route for delete user.
 * @name /v1/users/delete
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.delete('/deleteJwt', isAuthJwt, UserComponent.deleteByIdJwt);

module.exports = router;
