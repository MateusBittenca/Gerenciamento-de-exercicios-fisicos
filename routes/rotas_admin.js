const { request, response } = require("express");
const admin_create = require("../controller/admin_create");
const admin_login = require("../controller/admin_login");
const admin_delete = require("../controller/admin_delete");
const admin_update = require("../controller/admin.update");
const admin_read = require("../controller/admin_read");
const admin_readall = require("../controller/admins_read");

module.exports = function(app,banco){

    app.post("/admin/cadastrar",(request,response)=>{
        admin_create(request,response,banco);
    });
    app.post("/admin/login",(request,response)=>{
        admin_login(request,response,banco);
    });
    app.put("/admin/:adminID",(request,response)=>{
        admin_update(request,response,banco);
    });
    app.get("/admin/adminID",(request,response)=>{
        admin_read(request,response,banco);
    });
    app.delete("/admin/:adminID",(request,response)=>{
        admin_delete(request,response,banco);
    })
    app.get("/admin",(request,response)=>{
        admin_readall(request,response,banco);
    })
}