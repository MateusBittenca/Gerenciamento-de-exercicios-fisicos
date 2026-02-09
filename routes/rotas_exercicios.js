const { request, response } = require("express")

const exercicio_create = require("../controller/exercicio_create.js");
const exercicio_read = require("../controller/exercicio_read.js");
const exercicio_readById = require("../controller/exercicio_readById.js");
const exercicio_update = require("../controller/exercicio_update.js");
const exercicio_delete = require("../controller/exercicio_delete.js");

module.exports = function(app,banco){

    app.post("/exercicios",(request,response)=>{
       exercicio_create(request,response,banco);       
    });
    app.get("/exercicios",(request,response)=>{
        exercicio_read(request,response,banco);
    });
    app.get("/exercicios/:idexercicio",(request,response)=>{
        exercicio_readById(request,response,banco);
    });
    app.put("/exercicios/:idexercicio",(request,response)=>{
        exercicio_update(request,response,banco);
    });
    app.delete("/exercicios/:idexercicio",(request,response)=>{
        exercicio_delete(request,response,banco);
    });


}