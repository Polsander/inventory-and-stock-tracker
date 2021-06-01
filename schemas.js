
const Joi = require('joi');

module.exports.cabinetSchema = Joi.object({
        cabinet: Joi.object({
            name: Joi.string().required(),
        }).required()
});

module.exports.cabinetEditSchema = Joi.object({
    cabinet: Joi.object({
        name: Joi.string().required(),
        langley: Joi.number().required().integer().min(0),
        nakusp:Joi.number().required().integer().min(0),
    }).required()
});

module.exports.unitSchema = Joi.object({
    cabinet: Joi.object({
        name: Joi.string().required()
    }).required(),

    unit: Joi.object({
        name: Joi.string().required(),
    }).required()
});

module.exports.unitSchemaEdit = Joi.object({
    cabinet: Joi.object({
        name: Joi.string().required()
    }).required(),

    unit: Joi.object({
        name: Joi.string().required(),
        langley: Joi.number().required().integer().min(0),
    }).required()
});

module.exports.resetPasswordSchema = Joi.object({
    password: Joi.string().required(),
    password2: Joi.ref('password'),
});

module.exports.signupSchema = Joi.object({
    email: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required()
});

module.exports.inAndOutCabinetSchema = Joi.object({
    cabinet: Joi.object({
        name: Joi.string().required(),
        langley: Joi.number().required().integer().min(0),
    }).required()
});

module.exports.inAndOutUnitSchema = Joi.object({
    unit: Joi.object({
        name: Joi.string().required(),
        langley: Joi.number().required().integer().min(0),
    }).required()
});

//for admin when editing users
module.exports.editUserSchema = Joi.object({
    username: Joi.string().required(),
    email:Joi.string().required(),
    validateUser: Joi.string().required()
});