const { Schema } = require('mongoose');
const { mongoDBConnections } = require('../../config/connection');

const StaffSchema = new Schema(
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
        collection: 'staff',
        versionKey: false,
    },
);

module.exports = mongoDBConnections.model('StaffSchema', StaffSchema);
