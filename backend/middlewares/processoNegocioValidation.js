const { body } = require("express-validator");

const processoNegocioValidation = () => {
    return [
        body("nome")
            .not()
            .equals("undefined")
            .withMessage("O processo de negócio é obrigatório")
            .isString()
            .withMessage("A processo de negócio é obrigatório")
            .isLength({ min: 4 })
            .withMessage("O processo de negócio deve ter no mínimo 4 caracteres."),
    ];
};

module.exports = {
    processoNegocioValidation
};
