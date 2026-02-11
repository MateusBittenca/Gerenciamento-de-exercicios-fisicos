# Painel Administrativo Unifit

## Visão Geral

O Painel Administrativo do Unifit é uma interface completa e profissional para gerenciar todos os aspectos da plataforma, incluindo usuários, exercícios, listas, administradores, logs e relatórios avançados.

## Acesso

- **URL de Login**: `/login-admin`
- **Credenciais**: Use as credenciais de administrador cadastradas no banco de dados
- **Credenciais de teste** (do seed):
  - Email: `mpbittenc@gmail.com`
  - Senha: `123` (hash MD5: `202cb962ac59075b964b07152d234b70`)

## Funcionalidades Implementadas

### 1. Dashboard Principal (`/admin/dashboard`)
- **Estatísticas em tempo real**:
  - Total de usuários, exercícios, listas e administradores
  - Gráfico de crescimento de usuários (últimos 12 meses)
  - Distribuição de exercícios por músculo (gráfico de pizza)
  - Exercícios mais usados (gráfico de barras)
  - Tabela de atividades recentes (últimas 20 ações)

### 2. Gerenciamento de Usuários (`/admin/usuarios`)
- **Visualização completa**: Todos os usuários com dados de perfil
- **Filtros**: Por sexo, busca por nome/email
- **Estatísticas**:
  - IMC médio, altura e peso médio
  - Distribuição por sexo (gráfico de pizza)
  - Top 10 usuários com mais listas (gráfico de barras)
- **Ações**: Excluir usuários individualmente

### 3. Gerenciamento de Exercícios (`/admin/exercicios`)
- **CRUD completo**: Visualizar e excluir exercícios
- **Filtros**: Por músculo, dificuldade, busca por nome
- **Estatísticas**:
  - Taxa de utilização (usados vs não usados)
  - Distribuição por músculo (gráfico de barras)
  - Distribuição por dificuldade (gráfico de pizza)
- **Operações em massa**: 
  - Seleção múltipla com checkboxes
  - Exclusão em massa de exercícios selecionados

### 4. Gerenciamento de Listas (`/admin/listas`)
- **Visualização**: Listas recomendadas (globais) e de usuários
- **Filtros**: Por escopo (recomendadas/usuários), busca por nome/tipo
- **Estatísticas**:
  - Total de listas
  - Separação entre recomendadas e de usuários
  - Média de listas por usuário
- **Ações**: Excluir listas individualmente

### 5. Gerenciamento de Administradores (`/admin/admins`)
- **CRUD completo**: Criar, visualizar e excluir administradores
- **Criação**: Modal com formulário para novo admin
- **Filtros**: Busca por nome, email ou cargo
- **Estatísticas**: Total de admins, com/sem cargo definido

### 6. Logs de Atividades (`/admin/logs`)
- **Visualização completa**: Todas as ações do sistema
- **Filtros avançados**:
  - Tipo de usuário (admin/usuário)
  - Ação específica
  - Nome do usuário
  - Intervalo de datas (data inicial e final)
- **Paginação**: 100 logs por página
- **Export**: Exportar logs filtrados para CSV

### 7. Relatórios e Analytics (`/admin/relatorios`)
- **Relatório de Usuários**:
  - Distribuição por sexo
  - Distribuição de IMC por categoria
  - Estatísticas gerais (altura média, peso médio, IMC médio)
- **Relatório de Exercícios**:
  - Distribuição por dificuldade
  - Exercícios mais populares (top 8)
  - Taxa de utilização detalhada
- **Relatório de Listas**:
  - Exercícios mais usados em listas (top 10)
- **Botões de export**: Preparados para exportação em PDF (implementação futura)

## Tecnologias Utilizadas

### Backend
- **Node.js + Express**: Servidor API
- **MySQL**: Banco de dados
- **JWT**: Autenticação e autorização
- **ActivityLog Model**: Sistema de logs de atividades

### Frontend
- **React 19**: Framework UI
- **React Router 7**: Navegação
- **Recharts 2.12**: Gráficos e visualizações
- **SweetAlert2**: Modais e alertas
- **Axios**: Requisições HTTP

### Design System
- **Tema**: Dark elegante com accent vermelho (#dc2626)
- **Paleta de cores**:
  - Primary: `#dc2626` (vermelho)
  - Backgrounds: `#0c0c0c`, `#141414`, `#1c1c1c`
  - Text: `#fafafa`, `#d4d4d4`, `#a3a3a3`
- **Responsividade**: Mobile-first, adaptativo
- **Animações**: Transições suaves, fadeIn, slideInUp

## Estrutura de Arquivos

### Backend
```
Gerenciamento-de-exercicios-fisicos/
├── controller/
│   ├── stats_dashboard.js          # Estatísticas do dashboard
│   ├── stats_usuarios.js           # Analytics de usuários
│   ├── stats_exercicios.js         # Analytics de exercícios
│   ├── logs_read.js                # Leitura de logs
│   ├── admin_usuarios_block.js     # Bloquear usuários
│   └── exercicios_bulk.js          # Operações em massa
├── model/
│   └── ActivityLog.js              # Modelo de logs
├── middleware/
│   └── logger.js                   # Middleware de logging
├── routes/
│   └── rotas_admin_panel.js        # Rotas administrativas
└── database/
    └── UNIFIT.sql                  # Schema com tabela activity_logs
```

### Frontend
```
frontend/unifit/src/
├── components/admin/
│   ├── StatCard.jsx                # Card de estatística
│   ├── ChartCard.jsx               # Container para gráficos
│   ├── DataTable.jsx               # Tabela avançada
│   ├── FilterBar.jsx               # Barra de filtros
│   └── AdminSidebar.jsx            # Sidebar administrativa
├── pages/admin/
│   ├── AdminDashboard.jsx          # Dashboard principal
│   ├── AdminUsuarios.jsx           # Gestão de usuários
│   ├── AdminExercicios.jsx         # Gestão de exercícios
│   ├── AdminListas.jsx             # Gestão de listas
│   ├── AdminAdmins.jsx             # Gestão de admins
│   ├── AdminLogs.jsx               # Logs de atividades
│   └── AdminRelatorios.jsx         # Relatórios avançados
├── services/
│   ├── adminService.js             # API calls admin
│   └── logsService.js              # API calls logs
└── styles/
    └── admin.css                   # Estilos do painel
```

## Rotas da API

### Estatísticas
- `GET /admin/stats/dashboard` - Dashboard completo
- `GET /admin/stats/usuarios` - Analytics de usuários
- `GET /admin/stats/exercicios` - Analytics de exercícios

### Logs
- `GET /admin/logs` - Listar logs (com filtros e paginação)
- `GET /admin/logs/export` - Exportar logs para CSV

### Usuários
- `PATCH /admin/usuarios/:id/status` - Bloquear/Desbloquear usuário

### Exercícios
- `POST /admin/exercicios/bulk-delete` - Deletar múltiplos exercícios
- `POST /admin/exercicios/bulk-update` - Atualizar múltiplos exercícios

## Sistema de Logs

### Tabela `activity_logs`
```sql
CREATE TABLE activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_tipo ENUM('usuario', 'admin') NOT NULL,
  usuario_id INT NOT NULL,
  usuario_nome VARCHAR(100),
  acao VARCHAR(100) NOT NULL,
  detalhes TEXT,
  ip VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at),
  INDEX idx_usuario (usuario_tipo, usuario_id)
);
```

### Ações Registradas
- `LOGIN` - Login realizado
- `LOGOUT` - Logout realizado
- `CRIAR_EXERCICIO` - Exercício criado
- `ATUALIZAR_EXERCICIO` - Exercício atualizado
- `EXCLUIR_EXERCICIO` - Exercício excluído
- `CRIAR_LISTA` - Lista criada
- `ATUALIZAR_LISTA` - Lista atualizada
- `EXCLUIR_LISTA` - Lista excluída
- E outras ações personalizadas...

## Segurança

### Autenticação e Autorização
- **JWT Validation**: Todas as rotas admin validam o token JWT
- **Admin Check**: Middleware verifica se o usuário tem `AdministradorID`
- **Protected Routes**: Frontend usa `<ProtectedRoute adminOnly>` para rotas admin
- **Redirecionamento**: Não-admins são redirecionados para `/home`

### Boas Práticas
- Senhas em hash MD5 (considerar bcrypt para produção)
- Validação de entrada em todas as operações
- Confirmações para ações destrutivas (exclusões)
- Logs de todas as ações importantes

## Como Usar

### 1. Configuração Inicial
```bash
# Backend
cd Gerenciamento-de-exercicios-fisicos
npm install
node app.js

# Frontend
cd frontend/Unifit
npm install
npm run dev
```

### 2. Aplicar Migrations do Banco
```bash
# Execute o script SQL atualizado
mysql -u root -p unifit < database/UNIFIT.sql
```

### 3. Instalar Dependência Recharts
```bash
cd frontend/Unifit
npm install recharts
```

### 4. Acessar o Painel
1. Abra `http://localhost:5173/login-admin`
2. Faça login com credenciais de administrador
3. Você será redirecionado para `/admin/dashboard`

## Próximas Melhorias (Futuras)

1. **Exportação de Relatórios**:
   - Implementar geração de PDF com jsPDF
   - Exportação de gráficos como imagem

2. **Notificações em Tempo Real**:
   - WebSocket para logs em tempo real
   - Notificações push para ações importantes

3. **Dashboard Personalizável**:
   - Widgets drag-and-drop
   - Salvar preferências de visualização

4. **Backup e Restore**:
   - Backup automático do banco
   - Restore de versões anteriores

5. **Auditoria Avançada**:
   - Comparação de estados (antes/depois)
   - Timeline de mudanças

6. **Permissões Granulares**:
   - Diferentes níveis de acesso admin
   - Roles e permissões customizáveis

## Suporte e Contato

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para o Unifit**
