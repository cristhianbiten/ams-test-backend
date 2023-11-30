const mongoose = require("mongoose");
const db = process.env.MONGO_DB;

const conn = async () => {
    try {
        const dbConn = await mongoose.connect(db);
        console.log("Conectou ao banco de dados!");

        return dbConn;
    } catch (error) {
        console.error("Erro de conexão:", error.message);
        throw error; // Rejeitar o erro para que quem chama a função saiba que houve um problema
    }
};

conn();

module.exports = conn;
