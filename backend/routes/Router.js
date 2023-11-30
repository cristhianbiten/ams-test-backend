const express = require("express");
const router = express();

// test route
router.use("/api/users", require("./UserRoutes"));
router.use("/api/notes", require("./NotesRouter"));
router.use("/api/history", require("./HistoryRouter"));
router.use("/api/modulo", require("./ModuloRouter"));
router.use("/api/submodulo", require("./SubmoduloRouter"));
router.use("/api/processoNegocio", require("./ProcessoNegocioRouter"));

module.exports = router;