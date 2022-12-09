const Joi = require('joi');

const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    repassword: Joi.string().required().valid(Joi.ref('password')),
    first_name: Joi.string().required(),
    name: Joi.string().required(),
});

module.exports = schema;