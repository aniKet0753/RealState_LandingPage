// const Joi = require('joi');

// const validate = (schema) => (req, res, next) => {
//     const { error } = schema.validate(req.body, { abortEarly: false });

//     if (error) {
//         const errors = error.details.map(detail => ({
//             field: detail.context.key,
//             message: detail.message
//         }));
//         return res.status(400).json({ errors });
//     }

//     next();
// };

// module.exports = validate;