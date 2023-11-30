const express = require("express");
const router = express.Router();

const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidations");

const { insertHistory, getHistoriesByNoteId, deleteHistoryById } = require("../controllers/HistoryController");

const { historyValidation } = require("../middlewares/historyValidations");

router.post("/:id", authGuard, historyValidation(), validate, insertHistory);
router.get("/:id", getHistoriesByNoteId);
router.delete("/:id", authGuard, deleteHistoryById);


module.exports = router;