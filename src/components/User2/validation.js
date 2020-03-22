const Validation = require('../validation');

/**
 * @exports
 * @class
 * @extends Validation
 */
class UserValidation extends Validation {
    /**
     * @param {String} data.id - objectId
     * @returns
     * @memberof UserValidation
     */
    findById(data) {
        return this.Joi
            .object({
                id: this.Joi.objectId(),
            })
            .validate(data);
    }

    /**
     * @param {String} profile.email
     * @param {String} profile.fullName
     * @returns
     * @memberof UserValidation
     */
    entry(profile) {
        return this.Joi
            .object({
                email: this.Joi.string().email(),
                password: this.Joi
                    .string()
                    .min(1)
                    .max(37)
                    .required(),
            })
            .validate(profile);
    }

    /**
     * @param {String} profile.email
     * @param {String} profile.fullName
     * @returns
     * @memberof UserValidation
     */
    login(profile) {
        return this.Joi
            .object({
                id: this.Joi.objectId(),
                email: this.Joi.string().email(),
            })
            .validate(profile);
    }
}

module.exports = new UserValidation();
