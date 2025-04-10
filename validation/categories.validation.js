const Joi = require("joi");

exports.categoriesValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(30)
            .required()
            .messages({
                "string.base": "Kategoriya nomi matn bo'lishi kerak",
                "string.empty": "Kategoriya nomi bo'sh bo'lishi mumkin emas",
                "string.min": "Kategoriya nomi kamida 3 ta belgidan iborat bo'lishi kerak",
                "string.max": "Kategoriya nomi 30 tadan oshmasligi kerak",
                "any.required": "Kategoriya nomi kiritilishi shart"
            }),

        description: Joi.string()
            .min(10)
            .max(500)
            .required()
            .messages({
                "string.empty": "Tavsif bo'sh bo'lishi mumkin emas",
                "string.min": "Tavsif kamida 10 ta belgidan iborat bo'lishi kerak",
                "string.max": "Tavsif 500 tadan oshmasligi kerak",
                "any.required": "Tavsif kiritilishi shart"
            }),

        is_active: Joi.boolean()
            .required()
            .messages({
                "boolean.base": "is_active faqat true yoki false bo'lishi kerak",
                "any.required": "is_active qiymati majburiy"
            })
    });

    return schema.validate(body, { abortEarly: false });
};