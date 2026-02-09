require('dotenv').config();
const express = require('express');
const mysql = require('mysql');

const rotas_usuario = require('./routes/rotas_usuario');
const rotas_exercicios = require('./routes/rotas_exercicios');
const rotas_admin = require("./routes/rotas_admin");
const rotas_lista = require("./routes/rotas_lista");
const rotas_listaExer = require("./routes/rotas_listaExer");

const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Configuração de CORS para permitir requisições do frontend React
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', CORS_ORIGIN);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

app.use(express.json());
app.use(express.static('js'));
app.use('/',express.static(__dirname+'/view'));

const porta = process.env.PORT || 3000;
const complemento = "/index.html";
const host = 'http://localhost:' + porta + complemento;

const banco = mysql.createPool({
    connectionLimit: 128,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'unifit'
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