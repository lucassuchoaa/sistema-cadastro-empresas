# 🏢 Sistema de Cadastro de Empresas

[![CI/CD Pipeline](https://github.com/username/sistema-cadastro-empresas/actions/workflows/ci.yml/badge.svg)](https://github.com/username/sistema-cadastro-empresas/actions/workflows/ci.yml)
[![Deploy Status](https://img.shields.io/badge/deploy-vercel-black)](https://sistema-cadastro-empresas.vercel.app)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Semantic Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Um sistema web moderno e profissional para cadastro e gerenciamento de empresas, desenvolvido com Node.js, Express e EJS.

## 🌟 Características

- ✅ **Interface Moderna**: Design responsivo e intuitivo
- 🔐 **Autenticação Segura**: Sistema de login para super admin e empresas
- 📊 **Dashboard Administrativo**: Painel completo para gerenciamento
- 🏢 **Gestão de Empresas**: CRUD completo para empresas
- 🔒 **Segurança**: Senhas criptografadas e sessões seguras
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile
- 🚀 **Deploy Automático**: CI/CD com GitHub Actions e Vercel
- 📋 **Versionamento Semântico**: Releases automatizados

## 🚀 Demo

🌐 **[Ver Demo ao Vivo](https://sistema-cadastro-empresas.vercel.app)**

### Credenciais de Teste

**Super Administrador:**
- Usuário: `superadmin`
- Senha: `password`

## Funcionalidades

### 🏢 Multi-empresa
- Cada empresa possui sua própria landing page personalizada
- Sistema de autenticação individual por empresa
- Cores e logos personalizáveis

### 📝 Cadastro de Colaboradores
- Formulário responsivo e intuitivo
- Validação de dados em tempo real
- Confirmação visual de cadastro realizado

### 📊 Planilhas Automáticas
- Geração automática de planilhas Excel (.xlsx)
- Uma planilha por empresa
- Atualização em tempo real
- Download direto pelo dashboard

### 🎛️ Dashboard Administrativo
- Visualização de estatísticas
- Lista completa de colaboradores
- Busca e filtros
- Download de planilhas
- Auto-refresh dos dados

## Instalação

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd Cadatro
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor:**
```bash
npm start
```

Ou para desenvolvimento com auto-reload:
```bash
npm run dev
```

4. **Acesse o sistema:**
- Página principal: http://localhost:3000
- Área administrativa: http://localhost:3000/admin

## Como Usar

### 1. Criar uma Nova Empresa

1. Acesse http://localhost:3000/admin/criar-empresa
2. Preencha os dados:
   - **Nome da Empresa**: Nome completo da empresa
   - **Slug**: Identificador único (será usado na URL)
   - **Senha**: Senha para acesso administrativo
   - **Cor do Tema**: Cor principal da landing page
   - **Logo**: URL do logo (opcional)
3. Clique em "Criar Empresa"

### 2. Acessar a Landing Page

Após criar a empresa, a landing page estará disponível em:
```
http://localhost:3000/empresa/[slug-da-empresa]
```

### 3. Login Administrativo

1. Acesse http://localhost:3000/admin/login
2. Digite o slug da empresa e a senha
3. Acesse o dashboard para gerenciar colaboradores

### 4. Gerenciar Colaboradores

No dashboard você pode:
- Ver estatísticas em tempo real
- Listar todos os colaboradores
- Buscar colaboradores específicos
- Baixar a planilha atualizada
- Copiar o link do formulário

## Estrutura do Projeto

```
Cadatro/
├── server.js              # Servidor principal
├── package.json           # Dependências
├── views/                 # Templates EJS
│   ├── index.ejs         # Página inicial
│   ├── landing.ejs       # Landing page da empresa
│   ├── 404.ejs           # Página de erro
│   └── admin/            # Páginas administrativas
│       ├── login.ejs
│       ├── dashboard.ejs
│       └── criar-empresa.ejs
├── public/               # Arquivos estáticos
│   ├── css/
│   │   └── style.css
│   └── js/
└── planilhas/           # Planilhas geradas (criado automaticamente)
    └── [slug-empresa]/
        └── colaboradores.xlsx
```

## Tecnologias Utilizadas

- **Backend**: Node.js + Express
- **Frontend**: Bootstrap 5 + EJS
- **Planilhas**: XLSX.js
- **Autenticação**: bcryptjs + express-session
- **Estilização**: CSS3 + Font Awesome

## Funcionalidades Técnicas

### Segurança
- Senhas criptografadas com bcrypt
- Sessões seguras
- Validação de dados no servidor

### Performance
- Auto-refresh do dashboard (30s)
- Carregamento assíncrono
- CSS e JS otimizados

### Responsividade
- Design mobile-first
- Compatível com todos os dispositivos
- Interface adaptativa

## Personalização

### Cores da Empresa
Cada empresa pode ter sua cor personalizada que será aplicada em:
- Botões principais
- Headers dos cards
- Elementos de destaque
- Bordas e acentos

### Logo da Empresa
- Suporte a logos via URL
- Exibição automática na landing page
- Redimensionamento responsivo

## Dados Armazenados

Por colaborador:
- Nome completo
- E-mail
- Telefone
- Cargo
- Departamento
- Data de registro

## Suporte

Para dúvidas ou problemas:
1. Verifique se todas as dependências foram instaladas
2. Confirme se a porta 3000 está disponível
3. Verifique os logs do servidor no terminal

## Próximas Funcionalidades

- [ ] Banco de dados persistente
- [ ] Exportação em outros formatos (CSV, PDF)
- [ ] Notificações por email
- [ ] API REST
- [ ] Relatórios avançados
- [ ] Integração com sistemas externos