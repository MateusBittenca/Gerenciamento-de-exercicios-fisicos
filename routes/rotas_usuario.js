
const usuario_login = require('../controller/usuario_login');
const usuario_create = require("../controller/usuario_create");
const usuario_delete = require("../controller/usuario_delete");
const usuario_read = require("../controller/usuario_read");
const usuario_update = require('../controller/usuario_update');
const usuarioall_get = require("../controller/usuarios_read");



module.exports = function(app,banco){

    app.post("/usuario/login",(request,response)=>{
        usuario_login(request,response,banco);
    });
    app.post("/usuario/cadastrar",(request,response)=>{
        usuario_create(request,response,banco);
    });
    app.delete("/usuario/:usuarioId",(request,response)=>{ 
        usuario_delete(request,response,banco);
    });
    app.get("/usuario/:usuarioId",(request,response)=>{
        usuario_read(request,response,banco);
    });
    app.put("/usuario/:usuarioId",(request,response)=>{
        usuario_update(request,response,banco);
    })

    app.get("/usuarios",(request,response)=>{
        usuarioall_get(request,response,banco);
    })

}