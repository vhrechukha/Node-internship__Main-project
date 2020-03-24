const passport = require('passport');
const UserService = require('./service');
const UserValidation = require('./validation');
const ValidationError = require('../../error/ValidationError');


/**
 * @function login
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise < void >}
 */
function logIn(req, res) {
    return res.render('logIn.ejs', {
        csrfToken: req.csrfToken(),
    });
}

/**
 * @function signUp
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise < void >}
 */
function signUp(req, res) {
    return res.render('signUp.ejs', {
        csrfToken: req.csrfToken(),
    });
}

/**
 * @function findAll
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function findAll(req, res, next) {
    try {
        const users = await UserService.findAll();

        return res.render('users', {
            data: users,
            errormessage: '',
            csrfToken: req.csrfToken(),
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            details: null,
        });

        next(error);
    }
}

/**
 * @function register
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function register(req, res, next) {
    try {
        const { error } = UserValidation.create(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }
        await UserService.create(req.body);

        return res.redirect('/v1/users/logIn');
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function login
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function login(req, res, next) {
    try {
        await passport.authenticate('local', { name: req.body.email, password: req.body.password }, (err, user, info) => {
            if (err) return next(err);
            if (user) {
                // eslint-disable-next-line no-shadow
                req.logIn(user, (err) => {
                    if (err) return next(err);
                    return res.redirect('/v1/users');
                });
            }
        })(req, res, next);
    } catch (error) {
        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function logour
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function logout(req, res, next) {
    try {
        req.logout();
        return res.redirect('/v1/users/logIn');
    } catch (error) {
        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

module.exports = {
    logIn,
    signUp,
    findAll,
    register,
    login,
    logout,
};
