const UserService = require('./service');
const UserValidation = require('./validation');
const ValidationError = require('../../error/ValidationError');

/**
 * @function login
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise < void >}
 */
function logInPassport(req, res) {
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
function signUpPassport(req, res) {
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
async function findAllPassport(req, res, next) {
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
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function findByIdPassport(req, res, next) {
    try {
        const { error } = UserValidation.findById(req.params);

        if (error) {
            throw new ValidationError(error.details);
        }

        const user = await UserService.findById(req.params.id);

        return res.status(200).json({
            data: user,
            CSRFtoken: req.csrfToken(),
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
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function createPassport(req, res, next) {
    try {
        const { error } = UserValidation.create(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }
        await UserService.create(req.body);

        return res.redirect('/v1/users');
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                message: error.name,
                details: error.message,
            });
        }

        if (error.name === 'MongoError' && error.code === 11000) {
            res.render('users', { errormessage: req.flash('deletePostSuccessMsg') });
            // return res.redirect('/v1/users', req.flash('error', 'Error messoge'));
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
}

/**
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function updateByIdPassport(req, res, next) {
    try {
        const { error } = UserValidation.updateById(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        await UserService.updateById(req.body.id, req.body);

        return res.redirect('/v1/users');
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
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function deleteByIdPassport(req, res, next) {
    try {
        const { error } = UserValidation.deleteById(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        await UserService.deleteById(req.body.id);

        return res.redirect('/v1/users');
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
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function findAllJwt(req, res, next) {
    try {
        const users = await UserService.findAll();

        res.status(200).json({
            data: users,
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
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
async function findByIdJwt(req, res, next) {
    try {
        const { error } = UserValidation.findById(req.params);

        if (error) {
            throw new ValidationError(error.details);
        }

        const user = await UserService.findById(req.params.id);

        return res.status(200).json({
            data: user,
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
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function updateByIdJwt(req, res, next) {
    try {
        const { error } = UserValidation.updateById(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        const updatedUser = await UserService.updateById(req.body.id, req.body);

        return res.status(200).json({
            data: updatedUser,
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
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise<void>}
 */
async function deleteByIdJwt(req, res, next) {
    try {
        const { error } = UserValidation.deleteById(req.body);

        if (error) {
            throw new ValidationError(error.details);
        }

        const deletedUser = await UserService.deleteById(req.body.id);

        return res.status(200).json({
            data: deletedUser,
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

module.exports = {
    logInPassport,
    signUpPassport,
    findAllPassport,
    findByIdPassport,
    createPassport,
    updateByIdPassport,
    deleteByIdPassport,
    findAllJwt,
    findByIdJwt,
    updateByIdJwt,
    deleteByIdJwt,
};
