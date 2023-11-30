const Submodulo = require("../models/Submodulo");
const Modulo = require("../models/Modulo"); // Importe o modelo Modulo
const ProcessoNegocio = require("../models/ProcessoNegocio");

const insertSubmodulo = async (req, res) => {
    const { nome, moduloId } = req.body;

    try {
        // Verificar se o módulo existe
        const moduloExistente = await Modulo.findById(moduloId);

        if (!moduloExistente) {
            return res.status(400).json({ error: "O módulo especificado não existe." });
        }

        // Verificar se já existe um submódulo com o mesmo nome no contexto do módulo
        const existingSubmodulo = await Submodulo.findOne({ nome, modulo: moduloId });

        if (existingSubmodulo) {
            return res.status(400).json({ error: "Já existe um submódulo com esse nome no mesmo módulo." });
        }

        const nomeMaiusculas = nome.toUpperCase();

        // Crie o submódulo
        const submodulo = new Submodulo({
            nome: nomeMaiusculas,
            modulo: moduloId
        });

        await submodulo.save();

        // Atualize o array de submódulos do módulo correspondente
        moduloExistente.submodulos.push(submodulo);
        await moduloExistente.save();

        res.status(201).json(submodulo);
    } catch (error) {
        res.status(500).json({ error: "Não foi possível inserir o submódulo." });
    }
};

const getSubmoduloById = async (req, res) => {
    const submoduloId = req.params.id; // Assume que o ID é passado como um parâmetro na URL

    try {
        const submodulo = await Submodulo.findById(submoduloId)
            .populate("processosNegocio"); // Use o método populate para preencher processosNegocio

        if (!submodulo) {
            return res.status(404).json({ error: "Submódulo não encontrado." });
        }

        res.status(200).json(submodulo);
    } catch (error) {
        res.status(500).json({ error: "Não foi possível obter o submódulo." });
    }
};

const getAllSubmodulos = async (req, res) => {
    try {
        const submodulos = await Submodulo.find()
            .populate("processosNegocio"); // Use o método populate para preencher processosNegocio

        res.status(200).json(submodulos);
    } catch (error) {
        res.status(500).json({ error: "Não foi possível obter os submódulos." });
    }
};

const deleteSubmodulo = async (req, res) => {
    const submoduloId = req.params.id;

    try {
        // Verifica se o submódulo existe
        const submodulo = await Submodulo.findById(submoduloId);
        
        if (!submodulo) {
            return res.status(404).json({ error: "Submódulo não encontrado." });
        }

        // Remove os processoNegocio do submódulo
        const processosNegocio = await ProcessoNegocio.find({ submodulos: submoduloId });

        if (processosNegocio.length > 0) {
            // O submódulo está sendo referenciado por um processo de negócio
            // Exclui os processos de negócios
            for (const processoNegocio of processosNegocio) {
                console.log(processoNegocio);
                await ProcessoNegocio.deleteOne({ _id: processoNegocio._id });
            }
        }

        // Exclui o submódulo
        await Submodulo.deleteOne({ _id: submoduloId });

        // Atualiza o array de submódulos do módulo correspondente
        const modulo = await Modulo.findById(submodulo.modulo);
        modulo.submodulos.pull(submodulo);
        await modulo.save();

        res.status(200).json({ message: "Submódulo e processos de negócio excluídos com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Não foi possível excluir o submódulo." });
    }
};

module.exports = {
    insertSubmodulo,
    getAllSubmodulos,
    getSubmoduloById,
    deleteSubmodulo
};