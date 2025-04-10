const Joi = require("joi");

exports.productImageValidation = (body) => {
    const schema = Joi.object({
        productId: Joi.number().integer().required(),
        image_url: Joi.string().uri().required(),
        is_primary: Joi.boolean().required(),
        uploaded_at: Joi.date().required(),
        refresh_token: Joi.string().optional()
    });

    return schema.validate(body, { abortEarly: false });
};