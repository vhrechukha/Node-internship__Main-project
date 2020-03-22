function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/v1/users/entry');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return next();
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
};
