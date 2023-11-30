const express = require("express");
const router = express.Router();

// Controller

const { insertProcessoNegocio, getAllProcessosNegocio, getProcessoNegocioById ,deleteProcessoNegocio } = require("../controllers/ProcessoNegocioController");

// Middlewares
const { processoNegocioValidation } = require("../middlewares/processoNegocioValidation")
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidations");

// Routes
router.post("/", authGuard, processoNegocioValidation(), validate, insertProcessoNegocio);
router.get("/", authGuard, getAllProcessosNegocio);
router.get("/:id", authGuard, getProcessoNegocioById);
router.delete("/:id", authGuard, deleteProcessoNegocio);

module.exports = router;