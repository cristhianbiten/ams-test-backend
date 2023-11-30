const mongoose = require("mongoose");
const { Schema } = mongoose;

const notesSchema = new Schema(
    {
        idChamado: String,
        titulo: String,
        modulo: String,
        cliente: String,
        consultor: String,
        solicitacao: String,
        prioridade: String,

        origemSolicitacao: String,
        termoBusca: String,
        processoNegocio: String,
        descricaoFuncional: String,
        referenciaFt: String,
        cutover: String,
        request: String,

        definicaoProblema: String,
        causaProblema: String,
        alternativaSolucao: String,
        pedidoMelhoria: String,
        reproducaoProblema: String,

        reproducaoProcesso: String,
        esclarecimentoDuvida: String,
        duvida: String,

        sintomas: String,
        reproducaoErro: String,
        descricaoSolucao: String,
        configuracoesExecutadas: String,
        objetosAbap: String,
        history: [
            {
                descricao: String,
                data: String,
            }
        ],
        userId: mongoose.ObjectId,
        userName: String
    },
    {
        timestamps: true,
    }
);

Notes = mongoose.model("Notes", notesSchema);

module.exports = Notes;