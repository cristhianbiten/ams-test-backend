const { body } = require("express-validator");

const userCreateValidation = () => {
  return [
    body("nome")
      .isString()
      .withMessage("O nome é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres."),
    body("email")
      .isString()
      .withMessage("O e-mail é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail válido")
      .custom((value) => {
        if (!value.endsWith("@fusionconsultoria.com")) {
          throw new Error("O e-mail precisa ser da Fusion Consultoria.");
        }
        return true;
      }),
    body("password")
      .isString()
      .withMessage("A senha é obrigatória.")
      .isLength({ min: 8 }) // Mínimo de 8 caracteres para uma senha forte
      .withMessage("A senha precisa ter no mínimo 8 caracteres.")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!\\.]).*$/)
      .withMessage("A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial."),
    body("confirmPassword")
      .isString()
      .withMessage("A confirmação de senha é obrigatória.")
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("As senhas não são iguais.");
        }
        return true;
      }),
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("O e-mail é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail válido"),
    body("password").isString().withMessage("A senha é obrigatória."),
  ];
};

const userUpdateValidation = () => {
  return [
    body("nome")
      .optional()
      .isLength({ min: 4 })
      .withMessage("O nome precisa ter no mínimo 4 caracteres."),
    body("password")
      .optional()
      .isLength({ min: 8 }) // Mínimo de 8 caracteres para uma senha forte
      .withMessage("A senha precisa ter no mínimo 8 caracteres.")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!\\.]).*$/)
      .withMessage("A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial."),
  ];
};


module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};