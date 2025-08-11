# 🏢 Sistema de Cadastro de Empresas

[![CI/CD Pipeline](https://github.com/username/sistema-cadastro-empresas/actions/workflows/ci.yml/badge.svg)](https://github.com/username/sistema-cadastro-empresas/actions/workflows/ci.yml)
[![Deploy Status](https://img.shields.io/badge/deploy-vercel-black)](https://sistema-cadastro-empresas.vercel.app)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Semantic Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Um sistema web moderno e robusto para cadastro e gerenciamento de empresas, desenvolvido com **Node.js**, **Express**, **MongoDB** e **EJS**.

## 🌟 Características

- ✅ **Banco de Dados Robusto**: MongoDB com Mongoose para persistência de dados
- 🔐 **Autenticação Segura**: Sistema de login para super admin e empresas
- 📊 **Dashboard Administrativo**: Painel completo para gerenciamento
- 🏢 **Gestão de Empresas**: CRUD completo para empresas com validações
- 🔒 **Segurança Avançada**: Senhas criptografadas, sessões seguras e validações
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile
- 🚀 **Deploy Automático**: CI/CD com GitHub Actions e Vercel
- 📋 **Versionamento Semântico**: Releases automatizados
- 📈 **Performance**: Índices otimizados e queries eficientes
- 🔄 **Migração Automática**: Script para migrar dados existentes

## 🗄️ Arquitetura do Banco de Dados

### **MongoDB + Mongoose**
- **Persistência**: Dados salvos permanentemente no banco
- **Escalabilidade**: Suporte a milhares de empresas e colaboradores
- **Validações**: Schemas com validações automáticas
- **Índices**: Performance otimizada para consultas frequentes
- **Relacionamentos**: Referências entre empresas e colaboradores

### **Modelos de Dados**

#### **Empresa**
```javascript
{
  nome: String,           // Nome da empresa
  slug: String,           // Identificador único
  senha: String,          // Hash da senha
  cor: String,            // Cor do tema
  logo: String,           // URL do logo
  ativo: Boolean,         // Status ativo/inativo
  configuracoes: {        // Configurações personalizadas
    maxColaboradores: Number,
    camposObrigatorios: [String]
  }
}
```

#### **Colaborador**
```javascript
{
  empresa: ObjectId,      // Referência à empresa
  cpf: String,            // CPF único
  nome: String,           // Nome completo
  dataNascimento: Date,   // Data de nascimento
  rg: String,             // RG
  dataEmissaoRg: Date,    // Data de emissão
  orgaoEmissorRg: String, // Órgão emissor
  ufEmissao: String,      // UF de emissão
  dataAdmissao: Date,     // Data de admissão (opcional)
  status: String,         // ativo/inativo/pendente
  observacoes: String     // Observações adicionais
}
```

## 🚀 Demo

🌐 **[Ver Demo ao Vivo](https://sistema-cadastro-empresas.vercel.app)**

### Credenciais de Teste

**Super Administrador:**
- Usuário: `admin_master_2024`
- Senha: `Adm1n@2024#SecurePass!`

## 📋 Pré-requisitos

- **Node.js** >= 18.0.0
- **MongoDB** >= 4.4
- **npm** ou **yarn**

## 🛠️ Instalação

### 1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd sistema-cadastro-empresas
```

### 2. **Instale as dependências:**
```bash
npm install
```

### 3. **Configure o MongoDB:**
```bash
# Local
mongod

# Ou use MongoDB Atlas (cloud)
# Configure a variável MONGODB_URI_PROD no .env
```

### 4. **Configure as variáveis de ambiente:**
```bash
cp config/env.example .env
# Edite o arquivo .env com suas configurações
```

### 5. **Execute a migração:**
```bash
npm run migrate
```

### 6. **Inicie o servidor:**
```bash
npm start
```

Ou para desenvolvimento com auto-reload:
```bash
npm run dev
```

### 7. **Acesse o sistema:**
- Página principal: http://localhost:3000
- Área administrativa: http://localhost:3000/admin

## 🔧 Configuração do MongoDB

### **Local (Desenvolvimento)**
```bash
# Instalar MongoDB
brew install mongodb-community  # macOS
sudo apt install mongodb        # Ubuntu

# Iniciar serviço
sudo systemctl start mongod     # Linux
brew services start mongodb-community  # macOS
```

### **Cloud (Produção)**
1. Acesse [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie um cluster gratuito
3. Configure usuário e senha
4. Obtenha a string de conexão
5. Configure no arquivo `.env`:

```env
MONGODB_URI_PROD=mongodb+srv://usuario:senha@cluster.mongodb.net/sistema-cadastro-empresas
```

## 📊 Funcionalidades

### 🏢 Multi-empresa
- Cada empresa possui sua própria landing page personalizada
- Sistema de autenticação individual por empresa
- Cores e logos personalizáveis
- Configurações específicas por empresa

### 📝 Cadastro de Colaboradores
- Formulário responsivo e intuitivo
- Validação de dados em tempo real
- Verificação de CPF único por empresa
- Confirmação visual de cadastro realizado
- Campos obrigatórios configuráveis

### 📊 Planilhas Automáticas
- Geração automática de planilhas Excel (.xlsx)
- Uma planilha por empresa
- Atualização em tempo real
- Download direto pelo dashboard
- Formatação profissional dos dados

### 🎛️ Dashboard Administrativo
- Visualização de estatísticas em tempo real
- Lista completa de colaboradores
- Busca e filtros avançados
- Download de planilhas
- Auto-refresh dos dados
- Gestão de empresas

## 🏗️ Estrutura do Projeto

```
sistema-cadastro-empresas/
├── config/                 # Configurações
│   ├── database.js        # Configuração MongoDB
│   └── env.example        # Exemplo de variáveis
├── models/                 # Modelos MongoDB
│   ├── Empresa.js         # Schema da empresa
│   └── Colaborador.js     # Schema do colaborador
├── scripts/                # Scripts utilitários
│   └── migrate.js         # Migração de dados
├── server.js              # Servidor principal
├── package.json           # Dependências
├── views/                 # Templates EJS
│   ├── index.ejs         # Página inicial
│   ├── landing.ejs       # Landing page da empresa
│   ├── 404.ejs           # Página de erro
│   └── admin/            # Páginas administrativas
├── public/               # Arquivos estáticos
└── planilhas/           # Planilhas geradas
```

## 🔒 Segurança

### **Validações**
- Validação de CPF único por empresa
- Verificação de datas válidas
- Validação de URLs para logos
- Sanitização de dados de entrada

### **Autenticação**
- Senhas criptografadas com bcrypt (12 rounds)
- Sessões seguras com cookies httpOnly
- Middleware de autenticação
- Controle de acesso por nível

### **Proteção de Dados**
- Índices únicos para CPF
- Validação de relacionamentos
- Tratamento de erros robusto
- Logs de auditoria

## 📈 Performance

### **Otimizações MongoDB**
- Índices compostos para consultas frequentes
- Paginação automática
- Agregações eficientes
- Connection pooling

### **Cache e Sessões**
- Sessões em memória (Redis recomendado para produção)
- Headers de cache para arquivos estáticos
- Compressão gzip
- Timeout configurável

## 🚀 Deploy

### **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### **Variáveis de Ambiente (Produção)**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=seu_secret_super_seguro
SESSION_SECRET=session_secret_super_seguro
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com coverage
npm run test:coverage

# Testes de integração
npm run test:integration
```

## 📝 Logs e Monitoramento

### **Logs Estruturados**
```javascript
const logger = require('./utils/logger');

logger.info('Colaborador cadastrado', {
  empresa: empresa.slug,
  colaborador: colaborador.nome,
  timestamp: new Date()
});
```

### **Métricas**
- Total de empresas ativas
- Colaboradores por empresa
- Taxa de cadastros por dia
- Performance das consultas

## 🔮 Próximas Funcionalidades

- [ ] **API REST** completa
- [ ] **Webhooks** para integrações
- [ ] **Relatórios avançados** com gráficos
- [ ] **Notificações** por email/SMS
- [ ] **Backup automático** das planilhas
- [ ] **Auditoria completa** de ações
- [ ] **Multi-idioma** (i18n)
- [ ] **Dashboard em tempo real** (WebSocket)
- [ ] **Integração com sistemas externos**
- [ ] **Mobile app** nativo

## 🆘 Suporte

### **Problemas Comuns**

1. **MongoDB não conecta:**
   ```bash
   # Verificar se o serviço está rodando
   sudo systemctl status mongod
   
   # Verificar porta
   netstat -tlnp | grep 27017
   ```

2. **Erro de validação:**
   - Verificar se todos os campos obrigatórios estão preenchidos
   - CPF deve ser único por empresa
   - Datas não podem ser futuras

3. **Performance lenta:**
   - Verificar índices do MongoDB
   - Otimizar queries
   - Usar paginação

### **Contato**
- **Issues**: [GitHub Issues](https://github.com/username/sistema-cadastro-empresas/issues)
- **Documentação**: [Wiki](https://github.com/username/sistema-cadastro-empresas/wiki)
- **Discord**: [Servidor da Comunidade](https://discord.gg/...)

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

**⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!**