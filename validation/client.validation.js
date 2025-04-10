const Joi = require("joi");

exports.clientValidation = (body) => {
    const schemaClient = Joi.object({
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

        first_name: Joi.string()
            .min(2)
            .max(50)
            .optional()
            .messages({
                "string.base": "Ism matn bo'lishi kerak",
                "string.min": "Ism juda qisqa",
                "string.max": "Ism juda uzun"
            }),

        last_name: Joi.string()
            .min(2)
            .max(50)
            .optional()
            .messages({
                "string.base": "Familiya matn bo'lishi kerak",
                "string.min": "Familiya juda qisqa",
                "string.max": "Familiya juda uzun"
            }),

        passport: Joi.string()
            .alphanum()
            .min(7)
            .max(15)
            .optional()
            .messages({
                "string.alphanum": "Passport faqat harf va raqamlardan iborat bo'lishi kerak",
                "string.min": "Passport juda qisqa",
                "string.max": "Passport juda uzun"
            }),

        contact_phone: Joi.string()
            .pattern(/^\+?\d{9,15}$/)
            .optional()
            .messages({
                "string.pattern.base": "Telefon raqami noto‘g‘ri formatda. Masalan: +998901234567"
            }),

        joined_date: Joi.date()
            .optional()
            .messages({
                "date.base": "Sana noto‘g‘ri formatda"
            }),

        is_verified: Joi.boolean()
            .optional()
            .messages({
                "boolean.base": "is_verified faqat true yoki false bo'lishi kerak"
            }),

        hash_token: Joi.string()
            .optional(),

        refresh_token: Joi.string()
            .optional(),

        is_active: Joi.boolean()
            .required()
            .messages({
                "boolean.base": "is_active faqat true yoki false bo'lishi kerak",
                "any.required": "is_active qiymati kiritilishi kerak"
            }),
        
        // activation_link:Joi.string()
    });

    return schemaClient.validate(body, { abortEarly: false });
};