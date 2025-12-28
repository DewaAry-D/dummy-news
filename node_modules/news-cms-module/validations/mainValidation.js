const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    console.log("di validate");
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        console.log("validate berhasil");
        return next();
    }

    console.log("=== DETAIL ERROR VALIDASI ===");
    console.log(JSON.stringify(errors.array(), null, 2));

    return res.status(400).json({
        status: 'error',
        errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
        }))
    });
};

module.exports = {
    validate
};