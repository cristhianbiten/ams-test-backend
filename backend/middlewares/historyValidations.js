const { body } = require("express-validator");
const moment = require("moment"); // Certifique-se de que o módulo 'moment' esteja instalado

const historyValidation = () => {
    return [
        body("descricao")
            .not()
            .equals("undefined")
            .withMessage("A descrição é obrigatória")
            .isString()
            .withMessage("A descrição é obrigatória")
            .isLength({ min: 10 })
            .withMessage("A descrição precisa ter no mínimo 10 caracteres."),
        body("data")
            .not()
            .equals("undefined")
            .withMessage("A data é obrigatória")
            .isString()
            .withMessage("A data é obrigatória")
            .custom((value, { req }) => {
                const inputDate = moment(value, "DD/MM/YYYY"); // Parse da data de entrada
                const currentDate = moment(); // Data atual
                if (inputDate.isAfter(currentDate)) {
                    throw new Error("A data não pode ser maior que a atual");
                }
                return true;
            })
    ];
};

module.exports = {
    historyValidation
};
