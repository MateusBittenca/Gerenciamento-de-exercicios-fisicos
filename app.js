const express = require('express');
const mysql = require('mysql');

const rotas_usuario = require('./routes/rotas_usuario');
const rotas_exercicios = require('./routes/rotas_exercicios');
const rotas_admin = require("./routes/rotas_admin");
const rotas_lista = require("./routes/rotas_lista");
const rotas_listaExer = require("./routes/rotas_listaExer");

const app = express();
app.use(express.json());
app.use(express.static('js'));
app.use('/',express.static(__dirname+'/view'));

const porta = 3000;
const complemento = "/index.html"
const host = 'http://localhost:'+ porta + complemento;

const banco = mysql.createPool({
    connectionLimit : 128,
    host:'localhost',
    user:'root',
    password:'',
    database:'unifit'
});

rotas_usuario(app,banco);
rotas_exercicios(app,banco);
rotas_admin(app,banco);
rotas_lista(app,banco);
rotas_listaExer(app,banco);

app.listen(porta,function(){
    console.log("Servidor rodando:"+porta);
    console.log(">>"+host); 
});