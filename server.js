// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();
// Importa o módulo dotenv para gerenciar variáveis de ambiente
import dotenv from "dotenv";
import express from "express";
import routes from "./src/routes/postsRoutes.js";

// Cria uma instância do servidor Express
const app = express ();
app.use(express.static("uploads"))
routes(app);

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor escutando...");
});



