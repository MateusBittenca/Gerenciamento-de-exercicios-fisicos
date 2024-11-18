const lista_create = require("../controller/lista_create");
const lista_read = require("../controller/lista_read");
const lista_delete = require('../controller/lista_delete');
const lista_update = require("../controller/lista_update");
const lista_readAll = require("../controller/listaAll_read");
module.exports = function(app,banco){

    app.post("/lista/create",(request,response)=>{
        lista_create(request,response,banco);
    });

    app.get("/lista/:usuarioId",(request,response)=>{
        lista_read(request,response,banco);
    });

    app.get("/lista", (request,response)=>{
        lista_readAll(request,response,banco);
    })

    app.delete("/lista/delete/:idLista",(request,response)=>{
        lista_delete(request,response,banco);
    });

    app.put("/lista/update",(request,response)=>{
        lista_update(request,response,banco);
    });
  
}