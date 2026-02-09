# Guia de Migração - HTML/CSS/JS para React

## 📋 Resumo da Migração

Este documento descreve como a aplicação foi migrada de HTML/CSS/JS puro para React.

## 🔄 Mudanças Principais

### Estrutura de Arquivos

**Antes (HTML/CSS/JS):**
```
view/
├── *.html (múltiplos arquivos HTML)
├── css/ (arquivos CSS)
├── js/ (arquivos JavaScript)
├── image/ (imagens)
└── ExerciciosGif/ (GIFs)
```

**Depois (React):**
```
src/
├── pages/ (componentes de página)
├── components/ (componentes reutilizáveis)
├── services/ (lógica de API)
├── contexts/ (estado global)
├── styles/ (CSS)
└── assets/ (imagens e GIFs)
```

## 🎯 Principais Alterações

### 1. Navegação

**Antes:**
```javascript
window.location.href = 'home.html';
```

**Depois:**
```javascript
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/home');
```

### 2. Gerenciamento de Estado

**Antes:**
```javascript
let exercicios_json = {};
```

**Depois:**
```javascript
const [exercicios, setExercicios] = useState([]);
```

### 3. Chamadas de API

**Antes:**
```javascript
fetch('/exercicios', {
  method: 'get',
  headers: {
    'Authorization': "Bearer " + token
  }
})
```

**Depois:**
```javascript
import api from '../services/api';
const result = await exercicioService.getExercicios();
```

### 4. Manipulação do DOM

**Antes:**
```javascript
const card = document.createElement("div");
card.classList.add("card");
document.body.appendChild(card);
```

**Depois:**
```jsx
<div className="card">
  {/* conteúdo */}
</div>
```

### 5. Autenticação

**Antes:**
```javascript
const payload = localStorage.getItem('payload');
if (!payload) {
  window.location = "login.html";
}
```

**Depois:**
```jsx
import { useAuth } from '../contexts/AuthContext';
const { user, isAuthenticated } = useAuth();

// Rotas protegidas
<ProtectedRoute>
  <Home />
</ProtectedRoute>
```

## 🔧 Componentes Criados

### 1. AuthContext
Gerencia autenticação e estado do usuário globalmente.

### 2. ProtectedRoute
Protege rotas que requerem autenticação.

### 3. Sidebar
Menu lateral reutilizável em todas as páginas.

### 4. Modal
Modal reutilizável para exibir informações.

### 5. ExercicioCard
Card de exercício com modal de detalhes.

## 📝 Páginas Migradas

| HTML Original | Componente React | Descrição |
|--------------|------------------|-----------|
| index.html | Landing.jsx | Página inicial |
| login.html | Login.jsx | Login de usuário |
| login_admin.html | LoginAdmin.jsx | Login de admin |
| cadastro.html | Cadastro.jsx | Cadastro de usuário |
| home.html | Home.jsx | Dashboard principal |
| exercicios.html | Exercicios.jsx | Lista de exercícios |
| lista.html | Listas.jsx | Listas recomendadas |
| listasUsuario.html | MinhasListas.jsx | Listas do usuário |
| usuario.html | Usuario.jsx | Perfil do usuário |

## 🎨 Estilos (CSS)

Os arquivos CSS foram mantidos e adaptados:
- Caminhos de imagens atualizados para `../assets/images/`
- Classes CSS mantidas compatíveis
- Alguns estilos movidos para componentes específicos

## 🔐 Sistema de Autenticação

### Token JWT
- Armazenado no localStorage
- Incluído automaticamente em todas as requisições (interceptor do Axios)
- Atualizado automaticamente nas respostas

### Context API
```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

## 🚀 Melhorias Implementadas

1. **Componentização**: Código reutilizável e organizado
2. **Rotas**: Navegação SPA sem recarregar página
3. **Estado Global**: Context API para autenticação
4. **Interceptors**: Axios gerencia tokens automaticamente
5. **Hot Reload**: Desenvolvimento mais rápido com Vite
6. **Type Safety**: Preparado para TypeScript (se necessário)
7. **Build Otimizado**: Vite cria bundle otimizado para produção

## 📦 Dependências Adicionadas

- `react-router-dom`: Roteamento
- `axios`: Requisições HTTP
- `sweetalert2`: Alertas bonitos
- `vite`: Build tool moderna

## 🔄 Fluxo de Dados

```
Componente → Service → API (axios) → Backend
    ↓
  useState
    ↓
 Re-render
```

## ⚠️ Pontos de Atenção

1. **Backend**: Deve estar rodando em `http://localhost:3000`
2. **CORS**: Pode precisar configurar no backend
3. **Imagens**: Caminhos atualizados para usar imports do React
4. **LocalStorage**: Mantido para compatibilidade com backend

## 🧪 Como Testar

1. Inicie o backend: `node app.js`
2. Inicie o frontend: `npm run dev`
3. Acesse: `http://localhost:5173`
4. Teste o fluxo: Landing → Cadastro → Login → Home

## 📚 Recursos para Aprendizado

- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)
- [Vite](https://vitejs.dev)

## 🎓 Conceitos React Utilizados

- ✅ Componentes funcionais
- ✅ Hooks (useState, useEffect, useContext, useNavigate)
- ✅ Context API
- ✅ React Router
- ✅ Conditional Rendering
- ✅ Lists & Keys
- ✅ Forms & Controlled Components
- ✅ Custom Hooks (useAuth)
