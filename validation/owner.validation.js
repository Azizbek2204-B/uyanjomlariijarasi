const Joi = require("joi");

exports.ownerValidation = (body) => {
    const schemaOwner = Joi.object({
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
                "string.base": "Parol hash matn bo'lishi kerak",
                "string.empty": "Parol hash bo'sh bo'lishi mumkin emas",
                "string.min": "Parol hash kamida 8 belgidan iborat bo'lishi kerak",
                "any.required": "Parol hash majburiy"
            }),

        email: Joi.string()
            .email()
            .optional()
            .messages({
                "string.email": "Email formati noto‘g‘ri"
            }),

        company_name: Joi.string()
            .min(2)
            .max(100)
            .optional()
            .messages({
                "string.base": "Kompaniya nomi matn bo'lishi kerak",
                "string.min": "Kompaniya nomi juda qisqa",
                "string.max": "Kompaniya nomi juda uzun"
            }),

        contact_phone: Joi.string()
            .pattern(/^\+?\d{9,15}$/)
            .optional()
            .messages({
                "string.pattern.base": "Telefon raqami noto‘g‘ri formatda. Masalan: +998901234567"
            }),

        joined_date: Joi.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/) // yyyy-mm-dd
            .optional()
            .messages({
                "string.pattern.base": "joined_date formati yyyy-mm-dd bo‘lishi kerak"
            }),

        is_verified: Joi.boolean()
            .optional()
            .messages({
                "boolean.base": "is_verified faqat true yoki false bo'lishi kerak"
            }),

        refresh_token: Joi.string()
            .optional(),

        is_active: Joi.boolean()
                    .required()
                    .messages({
                        "boolean.base": "is_active faqat true yoki false bo'lishi kerak",
                        "any.required": "is_active qiymati kiritilishi kerak"
                    }),
    });

    return schemaOwner.validate(body, { abortEarly: false });
};
