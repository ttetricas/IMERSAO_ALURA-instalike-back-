import express from "express";
import multer from "multer";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controller/postsController.js";
import cors from "cors";

const corsOptions = {
    origin:"http://localhost:8000", 
    optionsSuccessStatus:200
}
// Configura o armazenamento de arquivos utilizando o Multer
// Destino: pasta 'uploads'
// Nome do arquivo: nome original do arquivo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

// Cria uma instância do Multer com a configuração de armazenamento
const upload = multer({ dest: "./uploads" , storage})
// Função que define as rotas da aplicação
const routes = (app) => {
    // Habilita o middleware para analisar JSON no corpo das requisições
    app.use(express.json());
    app.use(cors(corsOptions))
    // Rota para buscar todos os posts
    app.get("/posts", listarPosts);
    //Rota para criar um post
    app.post("/posts", postarNovoPost )
    // Faz upload de uma imagem
    app.post("/upload", upload.single("imagem"), uploadImagem )

    app.put("/upload/:id", atualizarNovoPost )
};

export default routes;