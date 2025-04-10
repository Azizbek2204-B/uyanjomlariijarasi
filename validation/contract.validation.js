const Joi = require("joi");

exports.contractValidation = (body) => {
    const schema = Joi.object({
        clientId: Joi.number().integer().required(),
        ownerId: Joi.number().integer().required(),
        productId: Joi.number().integer().required(),
        begin_date: Joi.date().required(),
        end_date: Joi.date().required(),
        statusId: Joi.number().integer().required(),
        created_at: Joi.date().required(),
        updated_at: Joi.date().required()
    });

    return schema.validate(body, { abortEarly: false });
};
