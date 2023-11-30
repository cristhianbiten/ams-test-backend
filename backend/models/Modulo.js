const mongoose = require("mongoose");
const { Schema } = mongoose;

const moduloSchema = new Schema({
    nome: String,
    submodulos: [{ type: Schema.Types.ObjectId, ref: "Submodulo" }] // Array de referências ao Submodulo
});

const Modulo = mongoose.model("Modulo", moduloSchema);

module.exports = Modulo;
