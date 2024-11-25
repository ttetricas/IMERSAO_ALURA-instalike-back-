import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModels.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função assíncrona para listar todos os posts
export async function listarPosts(req, res) 
{
    // Busca todos os posts
    const posts = await getTodosPosts();
    // Envia os posts como resposta em formato JSON com status 200 (OK)
    res.status(200).json(posts);
} 

// Função assíncrona para criar um novo post
export async function postarNovoPost(req, res) {
    // Obtém os dados do novo post enviados no corpo da requisição
    const novoPost = req.body;

    // Tenta criar o novo post
    try{
        // Chama a função para criar o post no banco de dados (ou outra fonte de dados)
        const postCriado = await criarPost(novoPost);
        // Envia o post criado como resposta em formato JSON com status 200 (OK)
        res.status(200).json(postCriado);
    } catch(erro) {
          // Imprime o erro no console para depuração
        console.error(erro.message);

        // Envia uma resposta de erro com status 500 (Internal Server Error)
        res.status(500).json({"Erro":"Falha na requisição"})
    }
    
}

// Função assíncrona para fazer upload de uma imagem e criar um novo post
export async function uploadImagem(req, res) {
    // Cria um objeto com os dados do novo post, incluindo o nome da imagem original
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };
    
    // Tenta criar o post e renomear a imagem
    try{
        // Chama a função para criar o post no banco de dados (ou outra fonte de dados)
        const postCriado = await criarPost(novoPost);
        // Gera um novo nome para a imagem com o ID do post
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
            // Renomeia o arquivo da imagem para o novo nome
        fs.renameSync(req.file.path, imagemAtualizada)
        // Envia o post criado como resposta em formato JSON com status 200 (OK)
        res.status(200).json(postCriado);
    } catch(erro) {
        // Imprime o erro no console para depuração
        console.error(erro.message);
        // Envia uma resposta de erro com status 500 (Internal Server Error)
        res.status(500).json({"Erro":"Falha na requisição"})
    }
}

export async function atualizarNovoPost(req, res) {
        // Obtém os dados do novo post enviados no corpo da requisição
        const id = req.params.id;
        const urlImagem = `http://localhost:3000/${id}.png`
        try{
            const imageBuffer = fs.readFileSync(`uploads/${id}.png`)
            const descricao =  await gerarDescricaoComGemini(imageBuffer)
            const post = {
                imgUrl: urlImagem,
                descricao: descricao,
                alt: req.body.alt
            }
            const postCriado = await atualizarPost(id, post);
            res.status(200).json(postCriado);
        } catch(erro) {
            console.error(erro.message);
            res.status(500).json({"Erro":"Falha na requisição"})
        }
}