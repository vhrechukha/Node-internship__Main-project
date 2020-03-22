const { Router } = require('express');
const UserComponent = require('.');
const isAuth = require('../../polices/isAuth');

/**
 * Express router to mount user related functions on.
 * @type {Express.Router}
 * @const
 */
const router = Router();

/**
 * Route which get data from created user.
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/create', UserComponent.create);

/**
 * Route for login user.
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/login', isAuth, UserComponent.login);

/**
 * Route for logout user.
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/logout', isAuth, UserComponent.logout);

/**
 * Route for continiue session.
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/continuationsession', isAuth, UserComponent.updateConnection);

/**
 * Route serving list of users.
 * @name /v1/users
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/', isAuth, UserComponent.findAll);

/**
 * Route serving a user
 * @name /v1/users/:id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/:id', isAuth, UserComponent.findById);

/**
 * Route serving a new user
 * @name /v1/users/update
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.put('/update', isAuth, UserComponent.updateById);

/**
 * Route serving a new user
 * @name /v1/users/delete
 * @function
 * @inner
 * @param {string} path -Express path
 * @param {callback} middleware - Express middleware
 */
router.delete('/delete', isAuth, UserComponent.deleteById);

module.exports = router;
