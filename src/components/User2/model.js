const { Schema } = require('mongoose');
const { mongoDBConnections } = require('../../config/connection');

const StaffSchema = new Schema(
    {
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
        collection: 'staff',
        versionKey: false,
    },
);

module.exports = mongoDBConnections.model('StaffModel', StaffSchema);
