const Joi = require("joi");

exports.adminValidation = (body) => {
    const schemaAdmin = Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .required()
            .messages({
                "string.base": "Foydalanuvchi nomi matn bo'lishi kerak",
                "string.empty": "Foydalanuvchi nomi bo'sh bo'lishi mumkin emas",
                "string.min": "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak",
                "string.max": "Foydalanuvchi nomi 30 tadan oshmasligi kerak",
                "any.required": "Foydalanuvchi nomi kiritilishi shart"
            }),

        password_hash: Joi.string()
            .min(8)
            .required()
            .messages({
                "string.empty": "Parol bo'sh bo'lishi mumkin emas",
                "string.min": "Parol kamida 8 belgidan iborat bo'lishi kerak",
                "any.required": "Parol majburiy"
            }),

        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.email": "Email noto'g'ri formatda",
                "string.empty": "Email bo'sh bo'lishi mumkin emas",
                "any.required": "Email kiritilishi shart"
            }),
        is_active: Joi.boolean()
            .required()
            .messages({
                "boolean.base": "is_active faqat true yoki false bo'lishi kerak",
                "any.required": "is_active qiymati kiritilishi kerak"
            }),

        last_login: Joi.date()
            .required()
            .messages({
                "date.base": "last_login haqiqiy sana bo'lishi kerak",
                "any.required": "last_login kiritilishi shart"
            }),

        refresh_token: Joi.string(),
        activation_link:Joi.string(),
        is_creator: Joi.boolean().default(false)
    });

    return schemaAdmin.validate(body, { abortEarly: false });
};