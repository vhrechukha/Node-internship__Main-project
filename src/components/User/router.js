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
router.get('/:id', isAuthJwt, UserComponent.findByIdJwt);

/**
 * JWT route for update user.
 * @name /v1/users/update
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.put('/update', isAuthJwt, UserComponent.updateByIdJwt);

/**
 * JWT route for delete user.
 * @name /v1/users/delete
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.delete('/delete', isAuthJwt, UserComponent.deleteByIdJwt);

module.exports = router;
