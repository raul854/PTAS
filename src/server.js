
//SEMANA 7
const express = require("express");
const app = express();
app.use(express.json());


let usuarios = [
  { id: 1, nome: "Ana", idade: 22 },
  { id: 2, nome: "Carlos", idade: 30 }
];


app.post("/users", (req, res) => {
  const { nome, idade } = req.body;
  const novoUsuario = { id: usuarios.length + 1, nome, idade };
  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});


app.get("/users", (req, res) => {
  res.json(usuarios);
});


app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const usuario = usuarios.find(u => u.id == id);
  if (!usuario) {
    return res.status(404).json({ mensagem: "Usuário não encontrado" });
  }
  res.json(usuario);
});


app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { nome, idade } = req.body;
  const usuario = usuarios.find(u => u.id == id);
  if (!usuario) {
    return res.status(404).json({ mensagem: "Usuário não encontrado" });
  }
  usuario.nome = nome || usuario.nome;
  usuario.idade = idade || usuario.idade;
  res.json(usuario);
});


app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  usuarios = usuarios.filter(u => u.id != id);
  res.json({ mensagem: "Usuário deletado com sucesso" });
});


app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});















//SEMANA 8

const express = require("express");
const fs = require("fs");
const Joi = require("joi");

const app = express();
app.use(express.json());

const DB_FILE = "./db.json";


function lerBanco() {
  const data = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(data);
}


function salvarBanco(dados) {
  fs.writeFileSync(DB_FILE, JSON.stringify(dados, null, 2));
}


const usuarioSchema = Joi.object({
  nome: Joi.string().min(3).required(),
  idade: Joi.number().min(0).required()
});


app.post("/users", (req, res) => {
  const { error } = usuarioSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ erro: error.details[0].message });
  }

  const banco = lerBanco();
  const novoUsuario = {
    id: banco.usuarios.length ? banco.usuarios[banco.usuarios.length - 1].id + 1 : 1,
    ...req.body
  };
  banco.usuarios.push(novoUsuario);
  salvarBanco(banco);

  res.status(201).json(novoUsuario);
});


app.get("/users", (req, res) => {
  const banco = lerBanco();
  res.json(banco.usuarios);
});


app.get("/users/:id", (req, res) => {
  const banco = lerBanco();
  const usuario = banco.usuarios.find(u => u.id == req.params.id);
  if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });
  res.json(usuario);
});


app.put("/users/:id", (req, res) => {
  const { error } = usuarioSchema.validate(req.body);
  if (error) return res.status(400).json({ erro: error.details[0].message });

  const banco = lerBanco();
  const usuario = banco.usuarios.find(u => u.id == req.params.id);
  if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

  usuario.nome = req.body.nome;
  usuario.idade = req.body.idade;
  salvarBanco(banco);

  res.json(usuario);
});


app.delete("/users/:id", (req, res) => {
  const banco = lerBanco();
  const usuariosFiltrados = banco.usuarios.filter(u => u.id != req.params.id);

  if (usuariosFiltrados.length === banco.usuarios.length) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  banco.usuarios = usuariosFiltrados;
  salvarBanco(banco);

  res.json({ mensagem: "Usuário deletado" });
});


app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));













//SEMANA 9 
const express = require("express");
const fs = require("fs");
const Joi = require("joi");

const app = express();
app.use(express.json());

const DB_FILE = "./db.json";


function lerBanco() {
  const data = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(data);
}
function salvarBanco(dados) {
  fs.writeFileSync(DB_FILE, JSON.stringify(dados, null, 2));
}


const usuarioSchema = Joi.object({
  nome: Joi.string().min(3).required(),
  idade: Joi.number().min(0).required()
});

const produtoSchema = Joi.object({
  nome: Joi.string().min(2).required(),
  preco: Joi.number().positive().required(),
  estoque: Joi.number().integer().min(0).required()
});



app.post("/users", (req, res) => {
  const { error } = usuarioSchema.validate(req.body);
  if (error) return res.status(400).json({ erro: error.details[0].message });

  const banco = lerBanco();
  const novoUsuario = {
    id: banco.usuarios.length ? banco.usuarios[banco.usuarios.length - 1].id + 1 : 1,
    ...req.body
  };
  banco.usuarios.push(novoUsuario);
  salvarBanco(banco);
  res.status(201).json(novoUsuario);
});


app.get("/users", (req, res) => {
  res.json(lerBanco().usuarios);
});


app.get("/users/:id", (req, res) => {
  const banco = lerBanco();
  const usuario = banco.usuarios.find(u => u.id == req.params.id);
  if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });
  res.json(usuario);
});


app.put("/users/:id", (req, res) => {
  const { error } = usuarioSchema.validate(req.body);
  if (error) return res.status(400).json({ erro: error.details[0].message });

  const banco = lerBanco();
  const usuario = banco.usuarios.find(u => u.id == req.params.id);
  if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

  usuario.nome = req.body.nome;
  usuario.idade = req.body.idade;
  salvarBanco(banco);
  res.json(usuario);
});


app.delete("/users/:id", (req, res) => {
  const banco = lerBanco();
  const usuariosFiltrados = banco.usuarios.filter(u => u.id != req.params.id);

  if (usuariosFiltrados.length === banco.usuarios.length) {
    return res.status(404).json({ erro: "Usuário não encontrado" });
  }

  banco.usuarios = usuariosFiltrados;
  salvarBanco(banco);
  res.json({ mensagem: "Usuário deletado" });
});



app.post("/products", (req, res) => {
  const { error } = produtoSchema.validate(req.body);
  if (error) return res.status(400).json({ erro: error.details[0].message });

  const banco = lerBanco();
  const novoProduto = {
    id: banco.produtos.length ? banco.produtos[banco.produtos.length - 1].id + 1 : 1,
    ...req.body
  };
  banco.produtos.push(novoProduto);
  salvarBanco(banco);
  res.status(201).json(novoProduto);
});


app.get("/products", (req, res) => {
  res.json(lerBanco().produtos);
});


app.get("/products/:id", (req, res) => {
  const banco = lerBanco();
  const produto = banco.produtos.find(p => p.id == req.params.id);
  if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });
  res.json(produto);
});


app.put("/products/:id", (req, res) => {
  const { error } = produtoSchema.validate(req.body);
  if (error) return res.status(400).json({ erro: error.details[0].message });

  const banco = lerBanco();
  const produto = banco.produtos.find(p => p.id == req.params.id);
  if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });

  produto.nome = req.body.nome;
  produto.preco = req.body.preco;
  produto.estoque = req.body.estoque;
  salvarBanco(banco);
  res.json(produto);
});


app.delete("/products/:id", (req, res) => {
  const banco = lerBanco();
  const produtosFiltrados = banco.produtos.filter(p => p.id != req.params.id);

  if (produtosFiltrados.length === banco.produtos.length) {
    return res.status(404).json({ erro: "Produto não encontrado" });
  }

  banco.produtos = produtosFiltrados;
  salvarBanco(banco);
  res.json({ mensagem: "Produto deletado" });
});



app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
