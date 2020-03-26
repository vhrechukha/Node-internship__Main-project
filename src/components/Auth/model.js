const { Schema } = require('mongoose');
const { mongoDBConnections } = require('../../config/connection');

const Staff2Schema = new Schema(
    {
        fullName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'staff2',
        versionKey: false,
    },
);

module.exports = mongoDBConnections.model('Staff2Schema', Staff2Schema);
