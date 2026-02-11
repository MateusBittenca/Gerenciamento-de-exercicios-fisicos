module.exports = class Administrador{

constructor(banco){
    this._banco = banco;
    this._administradorID  = null;
    this._nome = null;
    this._email = null;
    this._senha = null;
    this._cargo = null;
}

async create(){
    const operacao = new Promise((resolve,reject)=>{
        const nome = this._nome;
        const email = this._email;
        const senha = this._senha;
        const cargo = this._cargo;

        const parametros = [nome,email,senha,cargo];
        const sql = "INSERT INTO administradores (Nome,Email,Senha,Cargo) VALUES (?,?,md5(?),?);";
        this._banco.query(sql,parametros,function(erro,resultados){
            if(erro){
                console.log(erro);
                reject(erro);
            }else{
                resolve(JSON.stringify(resultados));
            }
        });
    });
    return operacao;
}


async read(){
    const operacao = new Promise((resolve,reject)=>{

        const adminID = this._administradorID;
        const parametros = [adminID];
        const sql = "SELECT * FROM administradores WHERE AdminstradoreID = ?;";

        this._banco.query(sql,parametros,function(erro,resultados){
            if(erro){
                reject(erro)
            }else{
                resolve(resultados);
            }
        });
    });
    return operacao;
}

async readall(){
    const operacao = new Promise((resolve,reject)=>{
        const adminID = this._administradorID;
        const parametros = [ adminID];
        const sql = "SELECT * FROM administradores;";

        this._banco.query(sql,parametros,function(erro,resultados){
            if(erro){
                reject(erro);
            }else{
                resolve(resultados);
            }
        });
    });
    return operacao;
}

async update(){
    const operacao = new Promise((resolve,reject)=>{
        const adminID = this._administradorID;
        const nome = this._nome;
        const email = this._email;
        const senha = this._senha;
        const cargo = this._cargo;

        const parametros = [nome,email,/*senha*/cargo,adminID];
        const sql = "UPDATE administradores SET Nome = ?, Email=?,  Cargo = ? WHERE AdministradorID = ?;";

        this._banco.query(sql,parametros,function(erro,resultados){
            if(erro){
                console.log(erro);
                reject(erro);
            }else{
                resolve(resultados);
            }
        });
    });
    return operacao;
}

async delete(){
    const operacao = new Promise((resolve,reject)=>{
        const adminID = this._administradorID;
        const parametros = [adminID];
        
        const sql = "DELETE FROM administradores WHERE AdministradorID = ?;";

        this._banco.query(sql,parametros,function(erro,resultados){
            if(erro){
                console.log(erro);
                reject(erro);

            }else{
                resolve(resultados);
            }
        });
    });
    return operacao;
}

async login(){
    const operacao = new Promise((resolve,reject)=>{
        const email = this._email;
        const senha = this._senha;
        const parametros = [email,senha];
        const sql = "SELECT COUNT (*) as qtd,AdministradorID,Nome,Email,Senha,Cargo FROM administradores WHERE Email = ? AND Senha = md5(?);";
        this._banco.query(sql,parametros,function(erro,resultados){
            if(erro){
                console.log(erro);
                reject(erro);
            }else{
                if(resultados[0].qtd>0){
                    const obj = {
                        status:true,
                        dados:{
                            AdministradorID:resultados[0].AdministradorID,
                            Nome:resultados[0].Nome,
                            Email:resultados[0].Email,
                            Cargo:resultados[0].Cargo
                        }
                    }
                    resolve(obj);
                }else{
                    const obj = {
                        status:false,
                        msg:'Falha ao fazer login'
                    }
                    resolve(obj);
                }
            }
        });
    });
    return operacao;
}

set banco(valor){
    this._banco = valor
}
get banco(){
    return this._banco;
}

set adminID(adminID){
    this._administradorID = adminID
}

get adminID(){
    return this._administradorID;
}

set nome(nome){
    this._nome = nome
}

get nome(){
    return this._nome;
}

set email(email){
    this._email = email;
}

get email(){
    return this._email;
}

set senha(senha){
    this._senha = senha;
}

get senha(){
    return this._senha;
}

set cargo(cargo){
    this._cargo = cargo;
}

get cargo(){
    return this._cargo;
}


}