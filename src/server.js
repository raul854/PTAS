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