function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/v1/users/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/v1/users/');
    }
    return next();
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
};
