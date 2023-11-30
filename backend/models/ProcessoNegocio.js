const mongoose = require("mongoose");
const { Schema } = mongoose;

const processoNegocioSchema = new Schema(
    {
        nome: String,
        submodulos: { type: Schema.Types.ObjectId, ref: "Submodulo" },// Referência ao Submódulo
    }
);

const ProcessoNegocio = mongoose.model("ProcessoNegocio", processoNegocioSchema);

module.exports = ProcessoNegocio;