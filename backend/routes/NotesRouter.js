const express = require("express");
const router = express.Router();

// Controller

const {insertNotes, deleteNote, getAllNotes, getUserNotes, getNoteById, updateNote, searchNotes} = require("../controllers/NotesController");

// Middlewares
const { notesValidation } = require("../middlewares/notesValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidations");

// Routes
router.post("/", authGuard, notesValidation(), validate, insertNotes);
router.delete("/:id", authGuard, deleteNote);
router.get("/search", searchNotes);
router.get("/", getAllNotes);
router.get("/user/:id", getUserNotes);
router.get("/:id", getNoteById);
router.put(
    "/:id",
    authGuard,
    validate,
    updateNote
  );

module.exports = router;