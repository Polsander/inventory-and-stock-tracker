
const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
});

const Joi = baseJoi.extend(extension);

module.exports.cabinetSchema = Joi.object({
        cabinet: Joi.object({
            name: Joi.string().required().escapeHTML(),
        }).required()
});

module.exports.cabinetEditSchema = Joi.object({
    cabinet: Joi.object({
        name: Joi.string().required().escapeHTML(),
        langley: Joi.number().required().integer().min(0),
        nakusp:Joi.number().required().integer().min(0),
    }).required()
});

module.exports.unitSchema = Joi.object({
    cabinet: Joi.object({
        name: Joi.string().required().escapeHTML()
    }).required(),

    unit: Joi.object({
        name: Joi.string().required().escapeHTML(),
    }).required()
});

module.exports.unitSchemaEdit = Joi.object({
    cabinet: Joi.object({
        name: Joi.string().required().escapeHTML()
    }).required(),

    unit: Joi.object({
        name: Joi.string().required().escapeHTML(),
        langley: Joi.number().required().integer().min(0),
    }).required()
});

module.exports.resetPasswordSchema = Joi.object({
    password: Joi.string().required(),
    password2: Joi.ref('password'),
});

module.exports.signupSchema = Joi.object({
    email: Joi.string().required().escapeHTML(),
    username: Joi.string().required().escapeHTML(),
    password: Joi.string().required()
});

module.exports.inAndOutCabinetSchema = Joi.object({
    cabinet: Joi.object({
        name: Joi.string().required().escapeHTML(),
        langley: Joi.number().required().integer().min(0),
    }).required()
});

module.exports.inAndOutUnitSchema = Joi.object({
    unit: Joi.object({
        name: Joi.string().required().escapeHTML(),
        langley: Joi.number().required().integer().min(0),
    }).required()
});

//for admin when editing users
module.exports.editUserSchema = Joi.object({
    username: Joi.string().required().escapeHTML(),
    email:Joi.string().required().escapeHTML(),
    validateUser: Joi.string().required()
});