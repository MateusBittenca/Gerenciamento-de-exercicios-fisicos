# Unifit - Frontend React

Sistema de gerenciamento de exercícios físicos desenvolvido em React.

## 🚀 Tecnologias Utilizadas

- React 19.2.0
- React Router DOM 7.x
- Axios
- SweetAlert2
- Vite
- Bootstrap Icons

## 📋 Pré-requisitos

- Node.js 20.19+ ou 22.12+ (recomendado)
- NPM 10+
- Backend rodando na porta 3000

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Certifique-se de que o backend está rodando na porta 3000:
```bash
cd ../..
node app.js
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse a aplicação em: http://localhost:5173

## 📁 Estrutura do Projeto

```
src/
├── assets/          # Imagens e GIFs
│   ├── images/      # Imagens da aplicação
│   └── gifs/        # GIFs dos exercícios
├── components/      # Componentes reutilizáveis
│   ├── Sidebar.jsx
│   ├── Modal.jsx
│   ├── ExercicioCard.jsx
│   └── ProtectedRoute.jsx
├── contexts/        # Contextos React
│   └── AuthContext.jsx
├── pages/           # Páginas da aplicação
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── LoginAdmin.jsx
│   ├── Cadastro.jsx
│   ├── Home.jsx
│   ├── Exercicios.jsx
│   ├── Listas.jsx
│   ├── MinhasListas.jsx
│   └── Usuario.jsx
├── services/        # Serviços de API
│   ├── api.js
│   ├── authService.js
│   ├── exercicioService.js
│   └── listaService.js
└── styles/          # Arquivos CSS
    ├── home.css
    ├── login.css
    ├── menu-lateral.css
    ├── exercicios.css
    ├── lista.css
    ├── table.css
    ├── modalExercicios.css
    └── usuario.css
```

## 🎯 Funcionalidades

### Usuário
- ✅ Cadastro e login
- ✅ Visualizar exercícios
- ✅ Filtrar exercícios por músculo
- ✅ Buscar exercícios por nome
- ✅ Criar listas personalizadas
- ✅ Adicionar exercícios às listas
- ✅ Visualizar listas recomendadas
- ✅ Gerenciar perfil

### Administrador
- ✅ Login de administrador
- ⏳ Gerenciar exercícios (CRUD)
- ⏳ Gerenciar usuários

## 🔐 Rotas

### Públicas
- `/` - Landing page
- `/login` - Login de usuário
- `/login-admin` - Login de administrador
- `/cadastro` - Cadastro de usuário

### Protegidas (requerem autenticação)
- `/home` - Página inicial
- `/exercicios` - Lista de exercícios
- `/listas` - Listas recomendadas
- `/minhas-listas` - Listas personalizadas do usuário
- `/usuario` - Perfil do usuário

## 🌐 API

O frontend consome a API REST que deve estar rodando em `http://localhost:3000`.

### Endpoints utilizados:
- `POST /usuario/login` - Login de usuário
- `POST /usuario/create` - Cadastro de usuário
- `POST /admin/login` - Login de administrador
- `GET /exercicios` - Listar exercícios
- `GET /lista` - Listar listas recomendadas
- `GET /lista/:usuarioId` - Listar listas do usuário
- `POST /lista/create` - Criar lista
- `POST /lista/exercicios/create` - Adicionar exercício à lista
- `GET /lista/exercicios/:idLista` - Listar exercícios de uma lista
- `DELETE /lista/exercicios/:idLista/:idExercicio` - Remover exercício da lista

## 🎨 Estilo

A aplicação utiliza um tema escuro com destaque em vermelho (#c30505) e background preto. Os estilos estão organizados por componente/página.

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 🐛 Troubleshooting

### Erro de CORS
Se houver problemas de CORS, certifique-se de que o backend está configurado para aceitar requisições do frontend.

### Imagens não aparecem
Verifique se os arquivos de imagem foram copiados corretamente para `src/assets/images/` e `src/assets/gifs/`.

### Token expirado
Se o token expirar, faça logout e login novamente.

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.
