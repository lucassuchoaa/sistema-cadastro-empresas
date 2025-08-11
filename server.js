const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const XLSX = require('xlsx');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'seu_jwt_secret_aqui';

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'session_secret',
  resave: false,
  saveUninitialized: true
}));

// Dados em memória (em produção, usar banco de dados)
let empresas = {};
let colaboradores = {};

// Credenciais do Super Admin
const SUPER_ADMIN = {
  usuario: 'admin_master_2024',
  senha: '$2a$10$HosiuIDD2JpSECeoCU8KqehF1Yyr/sn/DFsIgIVLwNKESPNEoeyDC' // Adm1n@2024#SecurePass!
};

// Middleware de autenticação
function requireAuth(req, res, next) {
  if (req.session.empresaId || req.session.isSuperAdmin) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

// Middleware para super admin apenas
function requireSuperAdmin(req, res, next) {
  if (req.session.isSuperAdmin) {
    next();
  } else {
    res.status(403).send('Acesso negado');
  }
}

// Rotas principais
app.get('/', (req, res) => {
  res.render('entrada');
});

// Rota para landing page específica da empresa
app.get('/empresa/:slug', (req, res) => {
  const slug = req.params.slug;
  const empresa = empresas[slug];
  
  if (!empresa) {
    return res.status(404).render('404');
  }
  
  res.render('landing', { empresa, slug });
});

// Rota para processar cadastro de colaborador
app.post('/empresa/:slug/cadastro', async (req, res) => {
  const slug = req.params.slug;
  const empresa = empresas[slug];
  
  if (!empresa) {
    return res.status(404).json({ error: 'Empresa não encontrada' });
  }
  
  const { cpf, nome, dataNascimento, rg, dataEmissaoRg, orgaoEmissorRg, ufEmissao, dataAdmissao } = req.body;
  
  // Adicionar colaborador
  if (!colaboradores[slug]) {
    colaboradores[slug] = [];
  }
  
  const novoColaborador = {
    id: Date.now(),
    cpf,
    nome,
    dataNascimento,
    rg,
    dataEmissaoRg,
    orgaoEmissorRg,
    ufEmissao,
    dataAdmissao,
    dataRegistro: new Date().toLocaleDateString('pt-BR')
  };
  
  colaboradores[slug].push(novoColaborador);
  
  // Atualizar planilha
  await atualizarPlanilha(slug);
  
  res.json({ success: true, message: 'Cadastro realizado com sucesso!' });
});

// Área administrativa
app.get('/admin', (req, res) => {
  res.redirect('/admin/login');
});

app.get('/admin/login', (req, res) => {
  res.render('admin/login', { query: req.query });
});

app.post('/admin/login', async (req, res) => {
  const { empresa, senha, tipo } = req.body;
  
  // Apenas Super Admin pode acessar a área administrativa
  if (tipo === 'superadmin' && empresa === SUPER_ADMIN.usuario && await bcrypt.compare(senha, SUPER_ADMIN.senha)) {
    req.session.isSuperAdmin = true;
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin/login', { error: 'Credenciais inválidas. Apenas o Super Admin pode acessar esta área.', query: req.query });
  }
});

app.get('/admin/dashboard', requireSuperAdmin, (req, res) => {
  // Apenas Super Admin pode acessar a área administrativa
  res.render('admin/super-dashboard', { 
    empresas,
    colaboradores,
    isSuperAdmin: true
  });
});

app.get('/admin/criar-empresa', requireSuperAdmin, (req, res) => {
  res.render('admin/criar-empresa');
});

app.post('/admin/criar-empresa', requireSuperAdmin, async (req, res) => {
  const { nome, slug, senha, cor, logo } = req.body;
  
  if (empresas[slug]) {
    return res.render('admin/criar-empresa', { error: 'Slug já existe' });
  }
  
  const senhaHash = await bcrypt.hash(senha, 10);
  
  empresas[slug] = {
    nome,
    slug,
    senha: senhaHash,
    cor: cor || '#007bff',
    logo: logo || '',
    dataCriacao: new Date().toLocaleDateString('pt-BR')
  };
  
  // Criar diretório para planilhas
  await fs.ensureDir(path.join(__dirname, 'planilhas', slug));
  
  res.redirect('/admin/login');
});

// Download de planilha
app.get('/download/:slug', requireSuperAdmin, (req, res) => {
  const slug = req.params.slug;
  const filePath = path.join(__dirname, 'planilhas', slug, 'colaboradores.xlsx');
  
  if (fs.existsSync(filePath)) {
    res.download(filePath, `colaboradores_${slug}.xlsx`);
  } else {
    res.status(404).send('Planilha não encontrada');
  }
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao destruir sessão:', err);
    }
    res.redirect('/admin/login');
  });
});

// Função para atualizar planilha
async function atualizarPlanilha(slug) {
  const colaboradoresEmpresa = colaboradores[slug] || [];
  
  const ws = XLSX.utils.json_to_sheet(colaboradoresEmpresa);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Colaboradores');
  
  const filePath = path.join(__dirname, 'planilhas', slug, 'colaboradores.xlsx');
  await fs.ensureDir(path.dirname(filePath));
  XLSX.writeFile(wb, filePath);
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});