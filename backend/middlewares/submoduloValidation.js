const { body } = require("express-validator");

const submoduloValidation = () => {
    return [
        body("nome")
            .not()
            .equals("undefined")
            .withMessage("O submódulo é obrigatório")
            .isString()
            .withMessage("A submódulo é obrigatório")
            .isLength({ max: 4 })
            .withMessage("O submódulo deve ter no máximo 4 caracteres.")
            .isLength({ min: 2 })
            .withMessage("O submódulo deve ter no mínimo 2 caracteres."),
    ];
};

module.exports = {
    submoduloValidation
};
