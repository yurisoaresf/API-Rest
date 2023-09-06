//Variáveis(constantes) para importar as bibliotecas necessárias pro projeto.
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");

//Variável(constante) demonstando como será o esquema do dado a ser salvo(json).
const FilmeSchema = {
    titulo: String,
    genero: String,
    ano: Number
}
const Filme = mongoose.model("Filme", FilmeSchema);
//Criação de uma variavel(constante), que dentro dela terá uma arrow function, que será asyn, necessaria para poder utilizar a syntax do await, e evitar os callbacks de then(), catch, etc.
const funcaoAsyncParaUsarOAwait = async() => {

    //Variáveis para determinar que o modelo de dado a ser salvo e recuperado, será o que foi determinado anteriormente pela const FilmeSchema (Json).
    // const Filme = mongoose.model("Filme", FilmeSchema);

    //Conectando-se ao banco de dados, utilizando o mongoose, será possivel conectar ao MongoDB, e utilizar as operaçoes de CRUD que ja vem junto com o framework Mongoose.
    console.log("Conectando-se ao banco de dados...");
    await mongoose.connect("mongodb://127.0.0.1/ProjetoServidorWeb");
    console.log("Estou conectado!");

    //Dado que será salvo no banco, aqui está sendo mockado, mas é possivel por exemplo, através dos metodos de API Rest que ainda será criado com ajuda do framework Express, será possível salvar um dado que virá do Postman, por exemplo.
    await Filme({titulo: "Senhor dos Anéis", genero: "Fantasia", ano: 2001}).save();


    //Variaveis para buscar os determinados filmes salvos.
    let procuraFilme = await Filme.find({});

    //let deleteFilme = await Filme.deleteMany({});

    //Exibição dos filmes encontrados.
    console.log(procuraFilme);

    //console.log(deleteFilme);

};

funcaoAsyncParaUsarOAwait();

//Inicio da criaçao do Servidor Web, criando variável(constante) para dizer que utilizarmos a partir de agora, o Express, tudo será chamado através do app.servidor web, com o express.
// const Filme = mongoose.model("Filme", FilmeSchema);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Fazendo a arquitetura de API Rest para manter recurso Filmes:
app.get("/filmes", async(req,res) => {
    const filmeExistente = await Filme.find({})
    res.json(filmeExistente);

});

app.post("/filmesSalvar", async(req, res) => {
    const filmesSalvos = await Filme(req.body).save()
    res.json(filmesSalvos);
});

app.put('/filmes/:id', async (req, res) => {
    res.json(await Filme.findOneAndUpdate({ _id: req.params.id}, req.body));
  });
  
  app.delete('/filmes/:id', async (req, res) => {
    res.json(await Filme.deleteOne({ _id: req.params.id}));
  });
  
  app.get('/filmes/:id', async (req, res) => {
    res.json(await Filme.findOne({ _id: req.params.id}));
  });

console.log("Iniciando o Servidor Web...");
app.listen(3000, () => {
    console.log("Servidor está no ar!");
    console.log("Acesse em http://127.0.0.1:3000");
});






