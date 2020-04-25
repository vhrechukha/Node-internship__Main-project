const LocalStrategy = require('passport-local').Strategy;
const StaffModel = require('../components/Auth/model');

function initialize(passport) {
    console.log('Passport connected!');

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, (email, password, done) => {
        StaffModel.findOne({ email }, (err, user) => {
            if (err) return done(err);

            if (!user) {
                return done(null, false, { message: 'Incorrect user.' });
            }

            if (password !== user.password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}

module.exports = initialize;
