const ProcessoNegocio = require("../models/ProcessoNegocio");
const Submodulo = require("../models/Submodulo"); // Importe o modelo Submodulo

const insertProcessoNegocio = async (req, res) => {
    const { nome, submoduloId } = req.body;

    try {
        // Verificar se o submódulo existe
        const submoduloExistente = await Submodulo.findById(submoduloId);

        if (!submoduloExistente) {
            return res.status(400).json({ error: "O submódulo especificado não existe." });
        }

        const processoNegocio = new ProcessoNegocio({
            nome,
            submodulos: submoduloId
        });

        await processoNegocio.save();

        // Adicione o ID do processo de negócio ao array de processosNegocio do submódulo
        submoduloExistente.processosNegocio.push(processoNegocio);
        await submoduloExistente.save();

        res.status(201).json(processoNegocio);
    } catch (error) {
        res.status(500).json({ error: "Não foi possível inserir o processo de negócio." });
    }
};

const getAllProcessosNegocio = async (req, res) => {
    try {
        const processosNegocio = await ProcessoNegocio.find();
        res.status(200).json(processosNegocio);
    } catch (error) {
        res.status(500).json({ error: "Não foi possível obter os processos de negócio." });
    }
};

const getProcessoNegocioById = async (req, res) => {
    const processoNegocioId = req.params.id; // Assume que o ID é passado como um parâmetro na URL

    try {
        const processoNegocio = await ProcessoNegocio.findById(processoNegocioId);

        if (!processoNegocio) {
            return res.status(404).json({ error: "Processo de negócio não encontrado." });
        }

        res.status(200).json(processoNegocio);
    } catch (error) {
        res.status(500).json({ error: "Não foi possível obter o processo de negócio." });
    }
};

const deleteProcessoNegocio = async (req, res) => {
    const processoNegocioId = req.params.id; // Assume que o ID é passado como um parâmetro na URL

    try {
        // Encontre o processo de negócio
        const processoNegocio = await ProcessoNegocio.findById(processoNegocioId);
    
        if (!processoNegocio) {
            return res.status(404).json({ error: "Processo de negócio não encontrado." });
        }
    
        // Encontre o submodulo
        const submodulo = await Submodulo.findById(processoNegocio.submodulos);
    
        // Remova o processo de negócio do submodulo
        submodulo.processosNegocio = submodulo.processosNegocio.filter((pn) => pn._id !== processoNegocio._id);
        await submodulo.save();
    
        // Exclua o processo de negócio
        await processoNegocio.deleteOne();
    
        res.status(200).json({ message: "Processo de negócio excluído com sucesso." });
    } catch (error) {
        res.status(500).json({ error: "Não foi possível excluir o processo de negócio." });
    }
};

module.exports = {
    insertProcessoNegocio,
    getAllProcessosNegocio,
    getProcessoNegocioById,
    deleteProcessoNegocio
};