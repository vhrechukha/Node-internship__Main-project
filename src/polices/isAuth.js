module.exports = (req, res, next) => {
    // eslint-disable-next-line global-require
    require('dotenv').config();
    // eslint-disable-next-line global-require
    const jwt = require('jsonwebtoken');

    jwt.verify(req.headers.refreshtoken, process.env.SECRETKEY, (error, decoded) => {
        if (error) res.status(406).json({ error });
        if (decoded) next();
    });
};
