const Joi = require("joi");

exports.reviewValidation = (body) => {
    const schema = Joi.object({
        productId: Joi.number().integer().required(),
        clientId: Joi.number().integer().required(),
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().min(3).required(),
        created_at: Joi.date().required()
    });

    return schema.validate(body, { abortEarly: false });
};