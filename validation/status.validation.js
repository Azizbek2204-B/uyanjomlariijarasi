const Joi = require("joi");

exports.statusValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        description: Joi.string().min(5).max(300).required(),
        category: Joi.string().min(3).max(30).required()
    });

    return schema.validate(body, { abortEarly: false });
};