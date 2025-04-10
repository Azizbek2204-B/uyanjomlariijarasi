const Joi = require("joi");

exports.productValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(10).required(),
        price: Joi.number().positive().required(),
        categoryId: Joi.number().integer().required(),
        ownerId: Joi.number().integer().required(),
        is_available: Joi.boolean().required(),
        rent_price: Joi.number().positive().required()
    });

    return schema.validate(body, { abortEarly: false });
};