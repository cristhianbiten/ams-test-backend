const Notes = require("../models/Notes");

const insertHistory = async (req, res) => {
    const { id } = req.params; // ID do "Note" associado ao histórico
    const { descricao, data } = req.body; // Dados do histórico

    try {
        const note = await Notes.findById(id);

        if (!note) {
            res.status(404).json({ errors: ["Note não encontrado!"] });
            return;
        }

        // Verifique se o "Note" pertence ao usuário
        const reqUser = req.user;
        if (!note.userId.equals(reqUser._id)) {
            res.status(422).json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
            return;
        }

        // Crie um objeto de histórico com os dados fornecidos
        const historyItem = {
            descricao,
            data,
        };

        // Adicione o histórico ao array de histórico do "Note"
        note.history.push(historyItem);

        // Salve as alterações no "Note" atualizado
        await note.save();

        // Obtenha o último histórico adicionado (que deve conter o _id)
        const addedHistory = note.history[note.history.length - 1];

        // Responda com o histórico, incluindo o _id
        res.status(201).json(addedHistory);
    } catch (error) {
        // Lide com erros apropriados
        res.status(500).json({ error: "Ocorreu um erro ao adicionar histórico ao Note." });
    }
};


const getHistoriesByNoteId = async (req, res) => {
    const { id } = req.params; // ID do "Note" associado ao histórico

    try {
        const note = await Notes.findById(id);

        if (!note) {
            res.status(404).json({ errors: ["Note não encontrado!"] });
            return;
        }

        // Recupere o array de históricos associados ao "Note"
        const histories = note.history;

        res.status(200).json(histories);
    } catch (error) {
        // Lide com erros apropriados
        res.status(500).json({ error: "Ocorreu um erro ao buscar históricos do Note." });
    }
};

const deleteHistoryById = async (req, res) => {
    const { id } = req.params; // ID do histórico

    try {
        // Procure por um "Note" que contenha o histórico com o _id fornecido
        const note = await Notes.findOne({ 'history._id': id });

        if (!note) {
            res.status(404).json({ errors: ["Histórico não encontrado!"] });
            return;
        }

        // Verifique se o "Note" pertence ao usuário
        const reqUser = req.user;
        console.log(reqUser._id);
        console.log(note.userId);
        console.log('note ' + note);
        if (!note.userId.equals(reqUser._id)) {
            res.status(422).json({ errors: ["Ocorreu um erro, tente novamente mais tarde"] });
            return;
        }

        // Encontre o índice do histórico que corresponde ao _id fornecido
        const historyIndex = note.history.findIndex(history => history._id.equals(id));

        if (historyIndex === -1) {
            res.status(404).json({ errors: ["Histórico não encontrado!"] });
            return;
        }

        // Remova o histórico do array de históricos do "Note"
        const deletedHistory = note.history.splice(historyIndex, 1);

        // Salve as alterações no "Note" atualizado
        await note.save();

        res.status(200).json({ id: deletedHistory[0]._id, message: "Histórico excluído com sucesso." });
    } catch (error) {
        // Lide com erros apropriados
        console.log(error);
        res.status(500).json({ error: "Ocorreu um erro ao excluir o histórico." });
    }
};


module.exports = {
    insertHistory,
    getHistoriesByNoteId,
    deleteHistoryById,
};