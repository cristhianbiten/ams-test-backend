const express = require("express");
const router = express.Router();

// Controller
const { insertModulo, getModulo, getAllModulos, deleteModulo } = require("../controllers/ModuloController");

// Middlewares
const { moduloValidation } = require("../middlewares/moduloValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidations");

// Routes
router.post("/", authGuard, moduloValidation(), validate, insertModulo);
router.get("/:id", getModulo);
router.get("/", getAllModulos);
router.delete("/:id", authGuard, deleteModulo);


module.exports = router;