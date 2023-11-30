const mongoose = require("mongoose");
const { Schema } = mongoose;

const submoduloSchema = new Schema({
    nome: String,
    modulo: { type: Schema.Types.ObjectId, ref: "Modulo" },
    processosNegocio: [{ type: Schema.Types.ObjectId, ref: "ProcessoNegocio" }]
});

const Submodulo = mongoose.model("Submodulo", submoduloSchema);

module.exports = Submodulo;