const Notes = require("../models/Notes");

const mongoose = require("mongoose");

const insertNotes = async (req, res) => {

    const {
        idChamado,
        titulo,
        modulo,
        cliente,
        consultor,
        solicitacao,
        prioridade,

        origemSolicitacao,
        termoBusca,
        processoNegocio,
        descricaoFuncional,
        referenciaFt,
        cutover,
        request,

        definicaoProblema,
        causaProblema,
        alternativaSolucao,
        pedidoMelhoria,
        reproducaoProblema,

        reproducaoProcesso,
        esclarecimentoDuvida,
        duvida,
        sintomas,
        reproducaoErro,
        descricaoSolucao,
        configuracoesExecutadas,
        objetosAbap,

    } = req.body;

    if (await validaId(idChamado)) {
        return res.status(422).json({
            errors: ["O note com este chamado já existe."],
        });
    }

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    // Create Notes
    const newNote = await Notes.create({
        idChamado,
        titulo,
        modulo,
        cliente,
        consultor,
        solicitacao,
        prioridade,

        origemSolicitacao,
        termoBusca,
        processoNegocio,
        descricaoFuncional,
        referenciaFt,
        cutover,
        request,

        definicaoProblema,
        causaProblema,
        alternativaSolucao,
        pedidoMelhoria,
        reproducaoProblema,

        reproducaoProcesso,
        esclarecimentoDuvida,
        duvida,
        sintomas,
        reproducaoErro,
        descricaoSolucao,
        configuracoesExecutadas,
        objetosAbap,

        userId: user._id,
        userName: user.nome,
    });

    // If user was note sucessfully, return data
    if (!newNote) {
        res.status(422).json({
            errors: ["Houve um erro, por favor tente novamente mais tarde."],
        });
        return;
    }

    res.status(201).json(newNote);
};


const validaId = async (idChamado) => {
    const existingNote = await Notes.findOne({ idChamado });

    // Return true if it exists, false otherwise
    return !!existingNote;

};

// Remove a note from the DB
const deleteNote = async (req, res) => {
    const { id } = req.params;

    const reqUser = req.user;

    try {
        console.log(`Tentando excluir a nota com ID: ${id}`);

        const note = await Notes.findById(new mongoose.Types.ObjectId(id));
        console.log('Nota encontrada:', note);

        // Check if note exists
        if (!note) {
            res.status(404).json({ errors: ["Note não encontrado!"] });
            return;
        }

        // Check if note belongs to user
        if (!note.userId.equals(reqUser._id)) {
            res
                .status(422)
                .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
            return;
        }

        await Notes.findByIdAndDelete(note._id);

        res
            .status(200)
            .json({ id: note._id, message: "Note excluída com sucesso." });

    } catch (error) {
        console.error('Erro ao tentar excluir a nota:', error);
        res.status(404).json({ errors: ["Note não encontrado!"] });
        return;
    }
};

const getAllNotes = async (req, res) => {
    const page = req.query.page || 1; // Página atual, padrão é 1
    const perPage = req.query.perPage || 6; // Número de documentos por página, padrão é 10

    try {
        const count = await Notes.countDocuments({}); // Total de documentos na coleção

        const notes = await Notes.find({})
            .sort([["createdAt", -1]])
            .skip((page - 1) * perPage) // Ignora documentos das páginas anteriores
            .limit(perPage) // Limita o número de documentos retornados por página
            .exec();

        return res.status(200).json({
            notes,
            currentPage: page,
            totalPages: Math.ceil(count / perPage),
        });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar notas." });
    }
};


// Get user notes
const getUserNotes = async (req, res) => {
    const { id } = req.params;

    try {
        const notes = await Notes.find({ userId: id })
            .sort([["createdAt", -1]])
            .exec();

        return res.status(200).json(notes);
    } catch (error) {
        console.log(error);
    }

};

// Get note by id
const getNoteById = async (req, res) => {
    const { id } = req.params;

    try {
        const note = await Notes.findById(new mongoose.Types.ObjectId(id));

        // Check if note exists
        if (!note) {
            res.status(404).json({ errors: ["Note não encontrado!"] });
            return;
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(404).json({ errors: ["Note não encontrado!"] });
        return;
    }

};

// Update a note
const updateNote = async (req, res) => {
    const { id } = req.params;
    const {
        idChamado,
        titulo,
        modulo,
        cliente,
        consultor,
        solicitacao,
        prioridade,

        origemSolicitacao,
        termoBusca,
        processoNegocio,
        descricaoFuncional,
        referenciaFt,
        cutover,
        request,

        definicaoProblema,
        causaProblema,
        alternativaSolucao,
        pedidoMelhoria,
        reproducaoProblema,

        reproducaoProcesso,
        esclarecimentoDuvida,
        duvida,
        sintomas,
        reproducaoErro,
        descricaoSolucao,
        configuracoesExecutadas,
        objetosAbap,

    } = req.body;


    const reqUser = req.user;

    try {
        const note = await Notes.findById(id);

        // Check if note exists
        if (!note) {
            res.status(404).json({ errors: ["Note não encontrado!"] });
            return;
        }

        // Check if note belongs to user
        if (!note.userId.equals(reqUser._id)) {
            res
                .status(422)
                .json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
            return;
        }

        if (idChamado) {
            note.idChamado = idChamado;
        }

        if (titulo) {
            note.titulo = titulo;
        }

        if (modulo) {
            note.modulo = modulo;
        }

        if (cliente) {
            note.cliente = cliente;
        }

        if (consultor) {
            note.consultor = consultor;
        }

        if (solicitacao) {
            note.solicitacao = solicitacao;
        }

        if (origemSolicitacao) {
            note.origemSolicitacao = origemSolicitacao;
        }

        if (termoBusca) {
            note.termoBusca = termoBusca;
        }

        if (processoNegocio) {
            note.processoNegocio = processoNegocio;
        }

        if (descricaoFuncional) {
            note.descricaoFuncional = descricaoFuncional;
        }

        if (referenciaFt) {
            note.referenciaFt = referenciaFt;
        }

        if (cutover) {
            note.cutover = cutover;
        }

        if (request) {
            note.request = request;
        }

        if (definicaoProblema) {
            note.definicaoProblema = definicaoProblema;
        }

        if (causaProblema) {
            note.causaProblema = causaProblema;
        }

        if (alternativaSolucao) {
            note.alternativaSolucao = alternativaSolucao;
        }

        if (pedidoMelhoria) {
            note.pedidoMelhoria = pedidoMelhoria;
        }

        if (reproducaoProcesso) {
            note.reproducaoProcesso = reproducaoProcesso;
        }

        if (esclarecimentoDuvida) {
            note.esclarecimentoDuvida = esclarecimentoDuvida;
        }

        if (prioridade) {
            note.prioridade = prioridade;
        }

        if (reproducaoProblema) {
            note.reproducaoProblema = reproducaoProblema;
        }

        if (duvida) {
            note.duvida = duvida;
        }

        if (sintomas) {
            note.sintomas = sintomas;
        }

        if (reproducaoErro) {
            note.reproducaoErro = reproducaoErro;
        }

        if (descricaoSolucao) {
            note.descricaoSolucao = descricaoSolucao;
        }

        if (configuracoesExecutadas) {
            note.configuracoesExecutadas = configuracoesExecutadas;
        }

        if (objetosAbap) {
            note.objetosAbap = objetosAbap;
        }

        await note.save();

        res.status(200).json({ note, message: "Note atualizado com sucesso!" });
    } catch (error) {
        if (!note) {
            res.status(404).json({ errors: ["Note não encontrado!"] });
            return;
        }
    }
};

const searchNotes = async (req, res) => {
    const { q } = req.query;

    const query = {
        $or: [
            { idChamado: new RegExp(q, "i") },
            { titulo: new RegExp(q, "i") },
            { modulo: new RegExp(q, "i") },
            { cliente: new RegExp(q, "i") },
            { consultor: new RegExp(q, "i") },
            { solicitacao: new RegExp(q, "i") },
            { origemSolicitacao: new RegExp(q, "i") },
            { termoBusca: new RegExp(q, "i") },
            { processoNegocio: new RegExp(q, "i") },
            { descricaoFuncional: new RegExp(q, "i") },
            { referenciaFt: new RegExp(q, "i") },
            { cutover: new RegExp(q, "i") },
            { request: new RegExp(q, "i") },
            { definicaoProblema: new RegExp(q, "i") },
            { causaProblema: new RegExp(q, "i") },
            { alternativaSolucao: new RegExp(q, "i") },
            { pedidoMelhoria: new RegExp(q, "i") },
            { reproducaoProcesso: new RegExp(q, "i") },
            { esclarecimentoDuvida: new RegExp(q, "i") },
            { prioridade: new RegExp(q, "i") },
            { reproducaoProblema: new RegExp(q, "i") },
            { duvida: new RegExp(q, "i") },
            { sintomas: new RegExp(q, "i") },
            { reproducaoErro: new RegExp(q, "i") },
            { descricaoSolucao: new RegExp(q, "i") },
            { configuracoesExecutadas: new RegExp(q, "i") },
            { objetosAbap: new RegExp(q, "i") },

            // Adicione outros campos relevantes aqui
        ]
    };

    try {
        const notes = await Notes.find(query).exec();

        res.status(200).json(notes);
    } catch (error) {
        res.status(404).json({ errors: ["Nada encontrado!"] });
        return;
    }
};


module.exports = {
    insertNotes,
    deleteNote,
    getAllNotes,
    getUserNotes,
    getNoteById,
    updateNote,
    searchNotes
};
