const Modulo = require("../models/Modulo");
const Submodulo = require("../models/Submodulo");
const ProcessoNegocio = require("../models/ProcessoNegocio");

const insertModulo = async (req, res) => {
    const { nome } = req.body;

    try {
        // Verificar se já existe um módulo com o mesmo nome
        const existingModulo = await Modulo.findOne({ nome });

        if (existingModulo) {
            return res.status(400).json({ error: "Já existe um módulo com esse nome." });
        }

        const nomeMaiusculas = nome.toUpperCase();

        const modulo = new Modulo({
            nome: nomeMaiusculas
        });

        await modulo.save();

        res.status(201).json(modulo);
    } catch (error) {
        res.status(500).json({ error: "Não foi possível inserir o módulo." });
    }
};

const getModulo = async (req, res) => {
    try {
        const moduloId = req.params.id;

        // Primeiro, obtenha o módulo pelo ID e popule-o
        const moduloPopulado = await Modulo.findById(moduloId)
            .populate({
                path: "submodulos",
                populate: {
                    path: "processosNegocio",
                },
            })
            .exec();  

        if (!moduloPopulado) {
            return res.status(404).json({ error: "Módulo não encontrado." });
        }
 
        console.log(moduloPopulado)
        res.status(200).json(moduloPopulado);
    } catch (error) {
        res.status(500).json({ error: "Não foi possível obter o módulo." });
    }
};

const getAllModulos = async (req, res) => {
    try {
        const modulos = await Modulo.find()
            .populate({
                path: "submodulos",
                populate: {
                    path: "processosNegocio",
                },
            })
            .exec();

        // Ordenar os módulos
        modulos.sort((a, b) => a.nome.localeCompare(b.nome));

        // Ordenar os submódulos dentro de cada módul
        modulos.forEach((modulo) => {
            modulo.submodulos.sort((a, b) => a.nome.localeCompare(b.nome));

            // Ordenar os processos de negócio dentro de cada submódulo
            modulo.submodulos.forEach((submodulo) => {
                submodulo.processosNegocio.sort((a, b) => a.nome.localeCompare(b.nome));
            });
        });

        res.status(200).json(modulos);
    } catch (error) {
        res.status(500).json({ error: "Não foi possível obter os módulos." });
    }
};


const deleteModulo = async (req, res) => {
    const moduloId = req.params.id;

    try {
        // Verifica se o módulo existe
        const modulo = await Modulo.findById(moduloId);
        if (!modulo) {
            return res.status(404).json({ error: "Módulo não encontrado." });
        }

        // Remove os submódulos relacionados
        const submodulos = await Submodulo.find({ modulo: moduloId });

        for (const submodulo of submodulos) {
            // Remove os processos de negócio relacionados
            const processosNegocio = await ProcessoNegocio.find({ submodulos: submodulo._id });

            for (const processoNegocio of processosNegocio) {
                await ProcessoNegocio.deleteOne({ _id: processoNegocio._id });
            }

            await submodulo.deleteOne(); // Use deleteOne para excluir o submódulo
        }

        await modulo.deleteOne(); // Use deleteOne para excluir o módulo

        res.status(200).json({ message: "Módulo, submódulos e processos de negócio excluídos com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Não foi possível excluir o módulo." });
    }
};

module.exports = {
    insertModulo,
    getModulo,
    getAllModulos,
    deleteModulo
};
