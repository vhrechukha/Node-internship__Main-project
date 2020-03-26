/* eslint-disable global-require */
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const express = require('express');

module.exports = {
    /**
     * @function
     * @description express middleware
     * @param {express.Application} app
     * @returns void
     */
    init(app) {
        app.use(
            bodyParser.urlencoded({
                extended: true,
            }),
        );
        app.use(bodyParser.json());
        // override with methods header in the request
        app.use(methodOverride('_method'));
        // parse Cookie header and populate req.cookies with an object keyed by the cookie names.
        app.use(cookieParser());
        // returns the compression middleware
        app.use(compression());
        // helps you secure your Express apps by setting various HTTP headers
        app.use(helmet());
        // providing a Connect/Express middleware that
        // can be used to enable CORS with various options
        app.use(cors());
        // cors
        app.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false },
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        require('./passport-config')(passport);
        // configure passport js

        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ');
            res.header('Access-Control-Allow-Credentials', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With,'
                + ' Content-Type, Accept,'
                + ' Authorization,'
                + ' Access-Control-Allow-Credentials',
            );
            next();
        });
        // configuration for ejs
        app.set('views', './src/views');
        app.set('view engine', 'ejs');
        // configuration for static files
        app.use(express.static(`${__dirname}/../content`));
    },
};
