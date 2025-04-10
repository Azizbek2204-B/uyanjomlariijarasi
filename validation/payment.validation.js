const Joi = require("joi");

exports.paymentValidation = (body) => {
    const schema = Joi.object({
        contractId: Joi.number().integer().required(),
        amount: Joi.number().positive().required(),
        payment_date: Joi.date().required(),
        payment_method: Joi.string().min(3).required(),
        transactionId: Joi.string().required(),
        statusId: Joi.number().required()
    });

    return schema.validate(body, { abortEarly: false });
};
