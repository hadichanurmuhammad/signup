const Joi = require('joi')

module.exports = Joi.object({
    phone: Joi.string()
            .pattern(/^9989[012345789][0-9]{7}$/)
            .required()
            .error(Error("Phone number is invalid"))
})