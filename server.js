require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const XLSX = require('xlsx');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');

// Importar configurações do MongoDB
const { connectDB } = require('./config/database');

// Importar modelos
const Empresa = require('./models/Empresa');
const Colaborador = require('./models/Colaborador');

// Importar serviços
const cnpjService = require('./services/cnpjService');
const excelService = require('./services/excelService');
const hubspotService = require('./services/hubspotService');

// Configurar multer para upload de arquivos
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo inválido. Use .xlsx ou .xls'));
    }
  }
});

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret_aqui';

// Conectar ao MongoDB
connectDB();

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

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

// ===== ROTAS DA LP DE CONSULTA CNPJ =====

// Página principal de consulta CNPJ
app.get('/cnpj', (req, res) => {
  res.render('cnpj-lookup');
});

// API: Buscar CNPJs
app.post('/api/cnpj/buscar', async (req, res) => {
  try {
    const { cnpjs } = req.body;
    
    if (!cnpjs || !Array.isArray(cnpjs) || cnpjs.length === 0) {
      return res.status(400).json({ error: 'CNPJs não fornecidos' });
    }
    
    const resultados = await cnpjService.buscarMultiplosCNPJs(cnpjs);
    
    res.json({ 
      success: true, 
      resultados,
      total: resultados.length,
      sucesso: resultados.filter(r => r.sucesso).length,
      erros: resultados.filter(r => !r.sucesso).length
    });
  } catch (error) {
    console.error('Erro ao buscar CNPJs:', error);
    res.status(500).json({ error: 'Erro ao buscar CNPJs' });
  }
});

// API: Upload e processamento de planilha
app.post('/api/cnpj/upload', upload.single('planilha'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Planilha não enviada' });
    }
    
    // Lê CNPJs da planilha
    const cnpjs = await excelService.lerCNPJsDaPlanilha(req.file.path);
    
    if (cnpjs.length === 0) {
      await fs.remove(req.file.path);
      return res.status(400).json({ error: 'Nenhum CNPJ válido encontrado na planilha' });
    }
    
    // Busca dados dos CNPJs
    const resultados = await cnpjService.buscarMultiplosCNPJs(cnpjs);
    
    // Remove arquivo temporário
    await fs.remove(req.file.path);
    
    res.json({ 
      success: true, 
      resultados,
      total: resultados.length,
      sucesso: resultados.filter(r => r.sucesso).length,
      erros: resultados.filter(r => !r.sucesso).length
    });
  } catch (error) {
    console.error('Erro ao processar planilha:', error);
    
    // Remove arquivo temporário em caso de erro
    if (req.file) {
      await fs.remove(req.file.path).catch(console.error);
    }
    
    res.status(500).json({ error: error.message || 'Erro ao processar planilha' });
  }
});

// API: Download do modelo de planilha
app.get('/cnpj/download-modelo', async (req, res) => {
  try {
    const filePath = await excelService.criarPlanilhaModelo();
    res.download(filePath, 'modelo_cnpj.xlsx', (err) => {
      if (err) {
        console.error('Erro ao fazer download:', err);
      }
    });
  } catch (error) {
    console.error('Erro ao criar modelo:', error);
    res.status(500).send('Erro ao gerar modelo de planilha');
  }
});

// API: Exportar resultados para Excel
app.post('/api/cnpj/exportar-excel', async (req, res) => {
  try {
    const { resultados } = req.body;
    
    if (!resultados || !Array.isArray(resultados)) {
      return res.status(400).json({ error: 'Resultados não fornecidos' });
    }
    
    const { filePath, fileName } = await excelService.exportarParaExcel(resultados);
    
    res.download(filePath, fileName, async (err) => {
      if (err) {
        console.error('Erro ao fazer download:', err);
      }
      // Remove arquivo após download
      await fs.remove(filePath).catch(console.error);
    });
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    res.status(500).json({ error: 'Erro ao exportar Excel' });
  }
});

// ===== ROTAS HUBSPOT =====

// API: Buscar pipelines do HubSpot
app.get('/api/hubspot/pipelines', async (req, res) => {
  try {
    if (!hubspotService.isConfigured()) {
      return res.json({ 
        success: false, 
        error: 'HubSpot não configurado. Configure a variável HUBSPOT_API_KEY no .env' 
      });
    }
    
    const pipelines = await hubspotService.buscarPipelines();
    res.json({ success: true, pipelines });
  } catch (error) {
    console.error('Erro ao buscar pipelines:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Exportar para HubSpot
app.post('/api/hubspot/exportar', async (req, res) => {
  try {
    const { resultados, opcoes } = req.body;
    
    if (!hubspotService.isConfigured()) {
      return res.json({ 
        success: false, 
        error: 'HubSpot não configurado. Configure a variável HUBSPOT_API_KEY no .env' 
      });
    }
    
    if (!resultados || !Array.isArray(resultados)) {
      return res.status(400).json({ success: false, error: 'Resultados não fornecidos' });
    }
    
    let empresasCriadas = 0;
    let contatosCriados = 0;
    let negociosCriados = 0;
    const erros = [];
    
    for (const resultado of resultados) {
      if (!resultado.sucesso || !resultado.dados) continue;
      
      try {
        let empresaId = null;
        
        // Criar empresa
        if (opcoes.criarEmpresa) {
          const empresa = await hubspotService.criarEmpresa(resultado.dados);
          empresaId = empresa.id;
          empresasCriadas++;
        }
        
        // Criar contatos (sócios)
        if (opcoes.criarContatos && empresaId && resultado.dados.socios?.length > 0) {
          const contatos = await hubspotService.criarContatos(resultado.dados.socios, empresaId);
          contatosCriados += contatos.length;
        }
        
        // Criar negócio
        if (opcoes.criarNegocio && empresaId) {
          await hubspotService.criarNegocio(
            resultado.dados, 
            empresaId, 
            opcoes.pipelineId, 
            opcoes.stageId
          );
          negociosCriados++;
        }
      } catch (error) {
        console.error(`Erro ao exportar ${resultado.dados.cnpj}:`, error);
        erros.push(`${resultado.dados.razaoSocial}: ${error.message}`);
      }
    }
    
    const summary = `
      Empresas criadas: ${empresasCriadas}
      Contatos criados: ${contatosCriados}
      Negócios criados: ${negociosCriados}
      ${erros.length > 0 ? `\nErros: ${erros.length}` : ''}
    `;
    
    res.json({ 
      success: true, 
      summary,
      detalhes: {
        empresas: empresasCriadas,
        contatos: contatosCriados,
        negocios: negociosCriados,
        erros
      }
    });
  } catch (error) {
    console.error('Erro ao exportar para HubSpot:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== FIM DAS ROTAS CNPJ/HUBSPOT =====

// Rota para landing page específica da empresa
app.get('/empresa/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const empresa = await Empresa.findOne({ slug, ativo: true });
    
    if (!empresa) {
      return res.status(404).render('404');
    }
    
    res.render('landing', { empresa, slug });
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    res.status(500).render('404');
  }
});

// Rota para processar cadastro de colaborador
app.post('/empresa/:slug/cadastro', async (req, res) => {
  try {
    const slug = req.params.slug;
    const empresa = await Empresa.findOne({ slug, ativo: true });
    
    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada' });
    }
    
    // Verificar se empresa pode receber mais colaboradores
    if (!empresa.podeReceberColaborador()) {
      return res.status(400).json({ error: 'Empresa atingiu limite de colaboradores' });
    }
    
    const { cpf, nome, dataNascimento, rg, dataEmissaoRg, orgaoEmissorRg, ufEmissao, dataAdmissao } = req.body;
    
    // Verificar se CPF já existe nesta empresa
    const cpfExistente = await Colaborador.findOne({ 
      cpf: cpf.replace(/\D/g, ''), 
      empresa: empresa._id 
    });
    
    if (cpfExistente) {
      return res.status(400).json({ error: 'CPF já cadastrado nesta empresa' });
    }
    
    // Criar novo colaborador
    const novoColaborador = new Colaborador({
      empresa: empresa._id,
      cpf: cpf.replace(/\D/g, ''),
      nome,
      dataNascimento: new Date(dataNascimento),
      rg,
      dataEmissaoRg: new Date(dataEmissaoRg),
      orgaoEmissorRg,
      ufEmissao,
      dataAdmissao: dataAdmissao ? new Date(dataAdmissao) : undefined
    });
    
    await novoColaborador.save();
    
    // Atualizar planilha
    await atualizarPlanilha(slug);
    
    res.json({ success: true, message: 'Cadastro realizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar colaborador:', error);
    
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: mensagens.join(', ') });
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Área administrativa
app.get('/admin', (req, res) => {
  res.redirect('/admin/login');
});

app.get('/admin/login', (req, res) => {
  res.render('admin/login', { query: req.query });
});

app.post('/admin/login', async (req, res) => {
  try {
    const { empresa, senha, tipo } = req.body;
    
    // Apenas Super Admin pode acessar a área administrativa
    if (tipo === 'superadmin' && empresa === SUPER_ADMIN.usuario && await bcrypt.compare(senha, SUPER_ADMIN.senha)) {
      req.session.isSuperAdmin = true;
      res.redirect('/admin/dashboard');
    } else {
      res.render('admin/login', { error: 'Credenciais inválidas. Apenas o Super Admin pode acessar esta área.', query: req.query });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    res.render('admin/login', { error: 'Erro interno do servidor', query: req.query });
  }
});

app.get('/admin/dashboard', requireSuperAdmin, async (req, res) => {
  try {
    // Buscar todas as empresas e colaboradores
    const empresas = await Empresa.find({ ativo: true }).sort({ nome: 1 });
    const colaboradores = {};
    
    for (const empresa of empresas) {
      colaboradores[empresa.slug] = await Colaborador.find({ empresa: empresa._id })
        .sort({ dataRegistro: -1 });
    }
    
    res.render('admin/super-dashboard', { 
      empresas,
      colaboradores,
      isSuperAdmin: true
    });
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

app.get('/admin/criar-empresa', requireSuperAdmin, (req, res) => {
  res.render('admin/criar-empresa');
});

app.post('/admin/criar-empresa', requireSuperAdmin, async (req, res) => {
  try {
    const { nome, slug, senha, cor, logo } = req.body;
    
    // Verificar se slug já existe
    const empresaExistente = await Empresa.findOne({ slug });
    if (empresaExistente) {
      return res.render('admin/criar-empresa', { error: 'Slug já existe' });
    }
    
    const senhaHash = await bcrypt.hash(senha, 10);
    
    const novaEmpresa = new Empresa({
      nome,
      slug,
      senha: senhaHash,
      cor: cor || '#007bff',
      logo: logo || ''
    });
    
    await novaEmpresa.save();
    
    // Criar diretório para planilhas
    await fs.ensureDir(path.join(__dirname, 'planilhas', slug));
    
    res.redirect('/admin/login');
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map(err => err.message);
      return res.render('admin/criar-empresa', { error: mensagens.join(', ') });
    }
    
    res.render('admin/criar-empresa', { error: 'Erro interno do servidor' });
  }
});

// Download de planilha
app.get('/download/:slug', requireSuperAdmin, async (req, res) => {
  try {
    const slug = req.params.slug;
    const empresa = await Empresa.findOne({ slug });
    
    if (!empresa) {
      return res.status(404).send('Empresa não encontrada');
    }
    
    const colaboradores = await Colaborador.find({ empresa: empresa._id })
      .sort({ dataRegistro: -1 });
    
    const filePath = path.join(__dirname, 'planilhas', slug, 'colaboradores.xlsx');
    
    // Gerar planilha
    const ws = XLSX.utils.json_to_sheet(colaboradores.map(c => ({
      CPF: c.cpf,
      Nome: c.nome,
      'Data Nascimento': c.dataNascimento.toLocaleDateString('pt-BR'),
      RG: c.rg,
      'Data Emissão RG': c.dataEmissaoRg.toLocaleDateString('pt-BR'),
      'Órgão Emissor': c.orgaoEmissorRg,
      'UF Emissão': c.ufEmissao,
      'Data Admissão': c.dataAdmissao ? c.dataAdmissao.toLocaleDateString('pt-BR') : 'Não informado',
      Status: c.status,
      'Data Registro': c.dataRegistro.toLocaleDateString('pt-BR')
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Colaboradores');
    
    await fs.ensureDir(path.dirname(filePath));
    XLSX.writeFile(wb, filePath);
    
    res.download(filePath, `colaboradores_${slug}.xlsx`);
  } catch (error) {
    console.error('Erro ao gerar planilha:', error);
    res.status(500).send('Erro ao gerar planilha');
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
  try {
    const empresa = await Empresa.findOne({ slug });
    if (!empresa) return;
    
    const colaboradores = await Colaborador.find({ empresa: empresa._id })
      .sort({ dataRegistro: -1 });
    
    const ws = XLSX.utils.json_to_sheet(colaboradores.map(c => ({
      CPF: c.cpf,
      Nome: c.nome,
      'Data Nascimento': c.dataNascimento.toLocaleDateString('pt-BR'),
      RG: c.rg,
      'Data Emissão RG': c.dataEmissaoRg.toLocaleDateString('pt-BR'),
      'Órgão Emissor': c.orgaoEmissorRg,
      'UF Emissão': c.ufEmissao,
      'Data Admissão': c.dataAdmissao ? c.dataAdmissao.toLocaleDateString('pt-BR') : 'Não informado',
      Status: c.status,
      'Data Registro': c.dataRegistro.toLocaleDateString('pt-BR')
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Colaboradores');
    
    const filePath = path.join(__dirname, 'planilhas', slug, 'colaboradores.xlsx');
    await fs.ensureDir(path.dirname(filePath));
    XLSX.writeFile(wb, filePath);
  } catch (error) {
    console.error('Erro ao atualizar planilha:', error);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/sistema-cadastro-empresas'}`);
});