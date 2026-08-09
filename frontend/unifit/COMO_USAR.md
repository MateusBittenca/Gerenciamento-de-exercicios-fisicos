# 🏋️ Como Usar o Unifit - Guia Completo

## 🚀 Iniciando a Aplicação

### 1️⃣ Preparar o Ambiente

**Backend:**
```bash
# Na pasta raiz do projeto
cd c:\Users\Mpbit\Documents\Unifit\Gerenciamento-de-exercicios-fisicos
node app.js
```

O backend deve estar rodando em: `http://localhost:3000`

**Frontend:**
```bash
# Na pasta do frontend React
cd c:\Users\Mpbit\Documents\Unifit\Gerenciamento-de-exercicios-fisicos\frontend\Unifit
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## 📱 Funcionalidades Disponíveis

### Para Usuários

#### 1. Cadastro
1. Acesse a página inicial
2. Clique em "CADASTRAR"
3. Preencha: Nome, Email e Senha
4. Clique em "Cadastrar"
5. Você será redirecionado para a página de login

#### 2. Login
1. Na página inicial, clique em "ENTRAR"
2. Digite seu email e senha
3. Clique em "Entrar"
4. Você será redirecionado para a Home

#### 3. Explorar Exercícios
**Na página Home:**
- Veja sugestões de exercícios
- Clique em um card para ver detalhes completos
- Visualize GIFs animados dos exercícios

**Na página Exercícios:**
- Veja todos os exercícios disponíveis
- Use a barra de busca para encontrar exercícios específicos
- Filtre por grupo muscular:
  - Bíceps
  - Tríceps
  - Peito
  - Costas
  - Ombro
  - Quadríceps
- Clique no ícone "+" para adicionar à uma lista

#### 4. Criar e Gerenciar Listas
**Criar nova lista:**
1. Vá em "Minhas Listas"
2. Clique em "Nova Lista"
3. Digite o nome e tipo da lista
4. Clique em "Criar Lista"

**Adicionar exercícios:**
1. Vá em "Exercícios"
2. Clique no ícone "+" no exercício desejado
3. Selecione a lista
4. Exercício adicionado!

**Ver exercícios da lista:**
1. Vá em "Minhas Listas"
2. Clique em "Ver Exercícios" na lista desejada
3. Você pode remover exercícios clicando em "Remover"

**Deletar lista:**
1. Vá em "Minhas Listas"
2. Clique em "Deletar" na lista desejada
3. Confirme a ação

#### 5. Ver Listas Recomendadas
1. Vá em "Listas" no menu lateral
2. Veja todas as listas recomendadas
3. Clique em "Ver Exercícios" para ver detalhes

#### 6. Perfil do Usuário
1. Clique no seu nome no menu lateral
2. Veja suas informações
3. Clique em "Sair" para fazer logout

### Para Administradores

#### Login de Admin
1. Na página inicial, clique em "Administradores"
2. Digite email e senha de admin
3. Acesse o painel administrativo

## 🎨 Navegação

### Menu Lateral
O menu lateral pode ser expandido/retraído clicando no ícone ☰

**Opções disponíveis:**
- 🏠 **Inicio**: Dashboard com sugestões
- 💪 **Exercicios**: Catálogo completo
- 📋 **Minhas Listas**: Suas listas personalizadas
- 📊 **Listas**: Listas recomendadas
- 👤 **Perfil**: Suas informações

## 💡 Dicas de Uso

### 🔍 Buscar Exercícios
- Digite o nome do exercício na barra de busca
- Use os filtros de músculo para resultados específicos
- Clique no card para ver GIF e instruções completas

### 📝 Organizar Treinos
1. Crie listas por tipo de treino (ex: "Treino A", "Treino B")
2. Ou por objetivo (ex: "Hipertrofia", "Definição")
3. Adicione os exercícios desejados
4. Acesse suas listas a qualquer momento

### ✨ Recursos Visuais
- **GIFs**: Veja como executar cada exercício
- **Modals**: Clique nos cards para detalhes completos
- **Tema Escuro**: Interface confortável para os olhos
- **Responsivo**: Funciona em desktop e mobile

## ⚠️ Solução de Problemas

### Não consigo fazer login
- Verifique se o email e senha estão corretos
- Certifique-se de que está cadastrado
- Verifique se o backend está rodando

### Não vejo exercícios
- Verifique se o backend está conectado ao banco de dados
- Certifique-se de que há exercícios cadastrados no banco
- Recarregue a página

### Imagens não aparecem
- Verifique se os arquivos foram copiados para `src/assets/`
- Limpe o cache do navegador (Ctrl + Shift + R)
- Verifique o console do navegador para erros

### Erro de CORS
- Configure o backend para aceitar requisições do frontend
- Adicione as headers CORS necessárias no Express

## 🔐 Segurança

- As senhas são armazenadas de forma segura no backend
- O token JWT expira automaticamente
- Faça logout ao terminar de usar em computadores públicos

## 📊 Recursos Avançados (Futuros)

- [ ] Upload de imagens personalizadas
- [ ] Compartilhar listas com outros usuários
- [ ] Gráficos de progresso
- [ ] Cronômetro para séries
- [ ] Notificações de treino

## 🆘 Suporte

Em caso de problemas:
1. Verifique se backend e frontend estão rodando
2. Consulte o console do navegador (F12)
3. Verifique os logs do backend
4. Consulte a documentação no README.md

## 🎯 Boas Práticas

1. **Organize suas listas**: Crie listas por dia da semana ou grupo muscular
2. **Explore os exercícios**: Use os filtros para encontrar variações
3. **Leia as instruções**: Clique nos cards para ver detalhes de execução
4. **Mantenha-se logado**: Seu progresso é salvo automaticamente

---

**Desenvolvido para facilitar sua jornada fitness! 💪🏋️‍♂️**
