const express = require("express");
const router = express.Router();

// Controller

const { insertSubmodulo, getAllSubmodulos, getSubmoduloById, deleteSubmodulo} = require("../controllers/SubmoduloController");

// Middlewares
const { submoduloValidation } = require("../middlewares/submoduloValidation")
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidations");

// Routes
router.post("/", authGuard, submoduloValidation(), validate, insertSubmodulo);
router.get("/", authGuard, getAllSubmodulos);
router.get("/:id", authGuard, getSubmoduloById);
router.delete("/:id", authGuard, deleteSubmodulo);

module.exports = router;