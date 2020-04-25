const passport = require('passport');
const UserService = require('./service');
const UserValidation = require('./validation');
const ValidationError = require('../../error/ValidationError');
const { redisConnections } = require('../../config/connection');

/**
 * @function registerPassport
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function registerPassport(req, res, next) {
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
 * @function loginPassport
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function loginPassport(req, res, next) {
    try {
        // eslint-disable-next-line consistent-return
        return passport.authenticate('local', { name: req.body.email, password: req.body.password }, (err, user) => {
            if (err) return next(err);
            if (user) {
                console.log('user');
                return req.logIn(user, (err) => {
                    if (err) return next(err);
                    return res.redirect('/v1/users');
                });
            }
            if (!user) {
                res.render('logIn.ejs', {
                    message: 'Chck your login or password',
                    csrfToken: req.csrfToken(),
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
 * @function logoutPassport
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function logoutPassport(req, res, next) {
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

/**
 * @function createJwt
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function createJwt(req, res, next) {
    try {
        const { error } = UserValidation.entry(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        const user = await UserService.create(req.body);

        return res.status(200).json({
            result: `${user.id} registered.`,
            status: 'registered',
            data: user,
        });
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
 * @function loginJwt
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function loginJwt(req, res, next) {
    try {
        const { error } = UserValidation.entry(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        const user = await UserService.findByEmail(req.body.email);

        if (req.body.password === user.password) {
            const accessToken = await UserService.generateAccessToken(user.email);
            const refreshToken = await UserService.generateRefreshToken(user.email);

            redisConnections.set(refreshToken, user.id);
            redisConnections.expire(refreshToken, 604800);

            return res.status(200).json({
                result: `${user.id} log in.`,
                status: 'login',
                data: user,
                tokens: {
                    AccessToken: accessToken,
                    RefreshToken: refreshToken,
                },
            });
        }
        return res.status(200).json({
            result: `${user.id} doesn't log in.`,
            status: 'notlogin',
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                error: error.name,
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
 * @function logoutJwt
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function logoutJwt(req, res, next) {
    try {
        const refreshToken = req.header('refreshToken');

        if (!refreshToken) return res.redirect('/v1/users');

        const user = await UserService.decode(refreshToken);

        redisConnections.del(refreshToken);

        return res.status(200).json({
            result: `${user.id} log out.`,
        });
    } catch (error) {
        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function updateConnectionJwt
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function updateConnectionJwt(req, res, next) {
    try {
        const oldRefreshToken = req.header('refreshToken');

        if (!oldRefreshToken) return res.redirect('/v1/users');

        const user = await UserService.decode(oldRefreshToken);
        console.log(user);

        const accessToken = await UserService.generateAccessToken(user.id);
        const refreshToken = await UserService.generateRefreshToken(user.id);

        redisConnections.del(oldRefreshToken);

        redisConnections.set(refreshToken, user.id);
        redisConnections.expire(refreshToken, 604800);

        return res.status(200).json({
            result: `${user.id} continiue session.`,
            tokens: {
                AccessToken: accessToken,
                RefreshToken: refreshToken,
            },
        });
    } catch (error) {
        res.status(500).json({
            result: 'Check your data',
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

module.exports = {
    registerPassport,
    loginPassport,
    logoutPassport,
    createJwt,
    loginJwt,
    logoutJwt,
    updateConnectionJwt,
};
