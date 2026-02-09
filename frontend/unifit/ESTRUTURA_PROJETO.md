# 📂 Estrutura Completa do Projeto Unifit React

## 🌳 Árvore de Diretórios

```
frontend/Unifit/
│
├── 📄 package.json                 # Dependências do projeto
├── 📄 package-lock.json           # Lock das dependências
├── 📄 vite.config.js              # Configuração do Vite
├── 📄 eslint.config.js            # Configuração do ESLint
├── 📄 index.html                  # HTML base
├── 📄 README.md                   # Documentação principal
├── 📄 MIGRATION_GUIDE.md          # Guia de migração
├── 📄 COMO_USAR.md               # Guia de uso
├── 📄 ESTRUTURA_PROJETO.md       # Este arquivo
│
├── 📁 public/                     # Arquivos públicos
│   └── vite.svg
│
└── 📁 src/                        # Código fonte
    │
    ├── 📄 main.jsx                # Entry point da aplicação
    ├── 📄 App.jsx                 # Componente principal + rotas
    ├── 📄 App.css                 # Estilos globais
    ├── 📄 index.css               # Estilos base
    │
    ├── 📁 assets/                 # Recursos estáticos
    │   ├── 📁 images/            # Imagens (7 arquivos)
    │   │   ├── academiaTCC.jpg
    │   │   ├── logo.png
    │   │   └── ...
    │   └── 📁 gifs/              # GIFs de exercícios (55+ arquivos)
    │       ├── Agachamento bulgaro.gif
    │       ├── barra fixa.gif
    │       └── ...
    │
    ├── 📁 components/             # Componentes reutilizáveis
    │   ├── 📄 Sidebar.jsx        # Menu lateral
    │   ├── 📄 Modal.jsx          # Modal genérico
    │   ├── 📄 ExercicioCard.jsx  # Card de exercício
    │   └── 📄 ProtectedRoute.jsx # Proteção de rotas
    │
    ├── 📁 contexts/               # Context API
    │   └── 📄 AuthContext.jsx    # Contexto de autenticação
    │
    ├── 📁 pages/                  # Páginas da aplicação
    │   ├── 📄 Landing.jsx        # Página inicial pública
    │   ├── 📄 Login.jsx          # Login de usuário
    │   ├── 📄 LoginAdmin.jsx     # Login de admin
    │   ├── 📄 Cadastro.jsx       # Cadastro de usuário
    │   ├── 📄 Home.jsx           # Dashboard principal
    │   ├── 📄 Exercicios.jsx     # Catálogo de exercícios
    │   ├── 📄 Listas.jsx         # Listas recomendadas
    │   ├── 📄 MinhasListas.jsx   # Listas do usuário
    │   └── 📄 Usuario.jsx        # Perfil do usuário
    │
    ├── 📁 services/               # Serviços de API
    │   ├── 📄 api.js             # Configuração Axios + interceptors
    │   ├── 📄 authService.js     # Serviços de autenticação
    │   ├── 📄 exercicioService.js # Serviços de exercícios
    │   └── 📄 listaService.js    # Serviços de listas
    │
    └── 📁 styles/                 # Arquivos CSS
        ├── 📄 index.css          # Estilos da landing
        ├── 📄 login.css          # Estilos de login/cadastro
        ├── 📄 home.css           # Estilos da home
        ├── 📄 menu-lateral.css   # Estilos do menu lateral
        ├── 📄 exercicios.css     # Estilos de exercícios
        ├── 📄 lista.css          # Estilos de listas
        ├── 📄 table.css          # Estilos de tabelas
        ├── 📄 modalExercicios.css # Estilos de modals
        └── 📄 usuario.css        # Estilos do perfil
```

## 📊 Estatísticas do Projeto

- **Total de Componentes**: 13
- **Total de Páginas**: 9
- **Total de Serviços**: 4
- **Total de Estilos CSS**: 10
- **Total de Assets**: 62+ (imagens e GIFs)
- **Linhas de Código**: ~2500+

## 🎯 Componentes por Categoria

### 🔓 Componentes Públicos
- `Landing.jsx` - Página inicial
- `Login.jsx` - Login de usuário
- `LoginAdmin.jsx` - Login de admin
- `Cadastro.jsx` - Registro de novo usuário

### 🔒 Componentes Protegidos
- `Home.jsx` - Dashboard com sugestões
- `Exercicios.jsx` - Catálogo completo
- `Listas.jsx` - Listas recomendadas
- `MinhasListas.jsx` - Listas personalizadas
- `Usuario.jsx` - Perfil e configurações

### 🧩 Componentes Reutilizáveis
- `Sidebar` - Menu de navegação
- `Modal` - Janelas modais
- `ExercicioCard` - Cards de exercício
- `ProtectedRoute` - HOC para proteção

## 🔄 Fluxo de Dados

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Páginas   │ ◄─── React Router
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Services   │ ◄─── Axios
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Backend   │ ◄─── Express + MySQL
└─────────────┘
```

## 🎨 Tema Visual

### Cores Principais
- **Background**: `#000000` (Preto)
- **Primária**: `#c30505` (Vermelho)
- **Secundária**: `#1f2021` (Cinza escuro)
- **Texto**: `#ffffff` (Branco)
- **Hover**: `#a00404` (Vermelho escuro)

### Tipografia
- **Fonte Principal**: Sans-serif
- **Tamanhos**:
  - H1: 70px
  - H2: 24px
  - Texto: 16px

## 🔐 Sistema de Autenticação

```
Login/Cadastro
      │
      ▼
  AuthContext ──► localStorage
      │              │
      ▼              ▼
  User State    JWT Token
      │              │
      ▼              ▼
Protected Route  API Calls
```

## 📱 Responsividade

- **Desktop**: > 768px (layout completo)
- **Tablet**: 768px - 480px (layout adaptado)
- **Mobile**: < 480px (layout mobile)

## 🚀 Scripts NPM

```bash
npm run dev      # Desenvolvimento (Vite)
npm run build    # Build de produção
npm run preview  # Preview do build
npm run lint     # Verificar código
```

## 📦 Dependências Principais

### Produção
- `react`: 19.2.0
- `react-dom`: 19.2.0
- `react-router-dom`: 7.x
- `axios`: latest
- `sweetalert2`: latest

### Desenvolvimento
- `vite`: 7.3.1
- `@vitejs/plugin-react`: 5.1.1
- `eslint`: 9.39.1

## 🔧 Configurações

### Vite (vite.config.js)
- Plugin React com Fast Refresh
- Porta padrão: 5173
- Hot Module Replacement (HMR)

### ESLint (eslint.config.js)
- Regras do React
- Hooks rules
- React Refresh

## 📈 Performance

- ⚡ **Fast Refresh**: Atualizações instantâneas
- 📦 **Code Splitting**: Carregamento otimizado
- 🎯 **Tree Shaking**: Bundle mínimo
- 💾 **Lazy Loading**: Rotas sob demanda

## 🧪 Testes Realizados

✅ Navegação entre rotas
✅ Login e autenticação
✅ Cadastro de usuário
✅ Listagem de exercícios
✅ Filtros e busca
✅ Criação de listas
✅ Adicionar exercícios às listas
✅ Visualização de modals
✅ Responsividade
✅ Proteção de rotas

## 🎓 Conceitos React Implementados

- ✅ Componentes Funcionais
- ✅ Hooks (useState, useEffect, useContext, useNavigate)
- ✅ Context API
- ✅ React Router v6+
- ✅ Conditional Rendering
- ✅ Lists & Keys
- ✅ Forms (Controlled Components)
- ✅ Event Handling
- ✅ Props & Prop Drilling
- ✅ Custom Hooks
- ✅ Higher-Order Components (ProtectedRoute)
- ✅ CSS Modules approach

## 🔮 Próximos Passos Sugeridos

1. **TypeScript**: Adicionar tipagem
2. **Testes**: Jest + React Testing Library
3. **State Management**: Redux/Zustand (se necessário)
4. **PWA**: Tornar Progressive Web App
5. **Dark/Light Mode**: Toggle de tema
6. **Internacionalização**: i18n
7. **Animações**: Framer Motion
8. **Cache**: React Query
9. **Forms**: React Hook Form
10. **Analytics**: Google Analytics

---

**Estrutura completa e pronta para produção! 🚀**
