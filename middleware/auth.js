const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');
const storage = require('../utils/storage');

// Middleware para verificar se o usuário está autenticado
function requireAuth(req, res, next) {
  try {
    // Verifica se há uma sessão ativa
    if (req.session.empresaId || req.session.isSuperAdmin) {
      return next();
    }

    // Verifica se há um token JWT válido
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      try {
        const decoded = jwt.verify(token, config.security.jwtSecret);
        
        if (decoded.empresaId) {
          req.session.empresaId = decoded.empresaId;
          return next();
        }
        
        if (decoded.isSuperAdmin) {
          req.session.isSuperAdmin = true;
          return next();
        }
      } catch (jwtError) {
        logger.warn('Token JWT inválido', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          error: jwtError.message
        });
      }
    }

    // Se não há autenticação válida, redireciona para login
    if (req.xhr || req.path.startsWith('/api/')) {
      return res.status(401).json({
        success: false,
        error: 'Não autorizado',
        details: 'Faça login para acessar este recurso'
      });
    }

    res.redirect('/admin/login');
  } catch (error) {
    logger.error('Erro no middleware de autenticação', error, {
      ip: req.ip,
      url: req.url,
      method: req.method
    });
    
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      details: 'Erro ao verificar autenticação'
    });
  }
}

// Middleware para verificar se é super admin
function requireSuperAdmin(req, res, next) {
  try {
    if (!req.session.isSuperAdmin) {
      logger.warn('Tentativa de acesso a recurso de super admin', {
        ip: req.ip,
        url: req.url,
        method: req.method,
        userAgent: req.get('User-Agent')
      });

      if (req.xhr || req.path.startsWith('/api/')) {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado',
          details: 'Apenas super administradores podem acessar este recurso'
        });
      }

      return res.status(403).send('Acesso negado. Apenas super administradores podem acessar este recurso.');
    }

    next();
  } catch (error) {
    logger.error('Erro no middleware de super admin', error, {
      ip: req.ip,
      url: req.url,
      method: req.method
    });
    
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      details: 'Erro ao verificar permissões'
    });
  }
}

// Middleware para verificar se é empresa específica
function requireEmpresaAuth(req, res, next) {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'Slug da empresa não fornecido'
      });
    }

    // Super admin pode acessar qualquer empresa
    if (req.session.isSuperAdmin) {
      return next();
    }

    // Verifica se a empresa está autenticada
    if (req.session.empresaId !== slug) {
      logger.warn('Tentativa de acesso a empresa não autorizada', {
        ip: req.ip,
        url: req.url,
        method: req.method,
        empresaSolicitada: slug,
        empresaAutenticada: req.session.empresaId
      });

      if (req.xhr || req.path.startsWith('/api/')) {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado',
          details: 'Você só pode acessar dados da sua própria empresa'
        });
      }

      return res.status(403).send('Acesso negado. Você só pode acessar dados da sua própria empresa.');
    }

    next();
  } catch (error) {
    logger.error('Erro no middleware de autenticação da empresa', error, {
      ip: req.ip,
      url: req.url,
      method: req.method
    });
    
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      details: 'Erro ao verificar permissões da empresa'
    });
  }
}

// Função para autenticar empresa
async function authenticateEmpresa(slug, senha) {
  try {
    const empresas = await storage.loadEmpresas();
    const empresa = empresas[slug];
    
    if (!empresa) {
      logger.warn('Tentativa de login com empresa inexistente', { slug });
      return { success: false, message: 'Empresa não encontrada' };
    }

    const senhaValida = await bcrypt.compare(senha, empresa.senha);
    
    if (!senhaValida) {
      logger.warn('Tentativa de login com senha incorreta', { slug });
      return { success: false, message: 'Senha incorreta' };
    }

    logger.success('Login de empresa realizado com sucesso', { slug });
    return { 
      success: true, 
      empresa: {
        slug: empresa.slug,
        nome: empresa.nome,
        cor: empresa.cor,
        logo: empresa.logo
      }
    };
  } catch (error) {
    logger.error('Erro ao autenticar empresa', error, { slug });
    return { success: false, message: 'Erro interno ao autenticar' };
  }
}

// Função para autenticar super admin
async function authenticateSuperAdmin(usuario, senha) {
  try {
    // Credenciais do Super Admin (em produção, usar variáveis de ambiente)
    const SUPER_ADMIN = {
      usuario: process.env.SUPER_ADMIN_USER || 'admin_master_2024',
      senha: process.env.SUPER_ADMIN_PASS || '$2a$10$HosiuIDD2JpSECeoCU8KqehF1Yyr/sn/DFsIgIVLwNKESPNEoeyDC'
    };

    if (usuario !== SUPER_ADMIN.usuario) {
      logger.warn('Tentativa de login com usuário super admin inexistente', { usuario });
      return { success: false, message: 'Usuário não encontrado' };
    }

    const senhaValida = await bcrypt.compare(senha, SUPER_ADMIN.senha);
    
    if (!senhaValida) {
      logger.warn('Tentativa de login com senha incorreta para super admin', { usuario });
      return { success: false, message: 'Senha incorreta' };
    }

    logger.success('Login de super admin realizado com sucesso', { usuario });
    return { success: true, isSuperAdmin: true };
  } catch (error) {
    logger.error('Erro ao autenticar super admin', error, { usuario });
    return { success: false, message: 'Erro interno ao autenticar' };
  }
}

// Função para gerar token JWT
function generateToken(payload) {
  try {
    return jwt.sign(payload, config.security.jwtSecret, {
      expiresIn: '24h',
      issuer: 'sistema-cadastro-empresas',
      audience: 'empresas-colaboradores'
    });
  } catch (error) {
    logger.error('Erro ao gerar token JWT', error);
    throw error;
  }
}

// Função para verificar token JWT
function verifyToken(token) {
  try {
    return jwt.verify(token, config.security.jwtSecret);
  } catch (error) {
    logger.warn('Token JWT inválido', { error: error.message });
    return null;
  }
}

// Middleware para rate limiting básico
function rateLimit(maxRequests = 100, windowMs = 15 * 60 * 1000) {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      const userRequests = requests.get(ip);
      
      if (now > userRequests.resetTime) {
        userRequests.count = 1;
        userRequests.resetTime = now + windowMs;
      } else {
        userRequests.count++;
      }
      
      if (userRequests.count > maxRequests) {
        logger.warn('Rate limit excedido', {
          ip,
          count: userRequests.count,
          maxRequests,
          windowMs
        });
        
        return res.status(429).json({
          success: false,
          error: 'Muitas requisições',
          details: 'Você excedeu o limite de requisições. Tente novamente mais tarde.'
        });
      }
    }
    
    next();
  };
}

// Middleware para verificar se a empresa existe
async function requireEmpresaExists(req, res, next) {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'Slug da empresa não fornecido'
      });
    }

    const empresas = await storage.loadEmpresas();
    
    if (!empresas[slug]) {
      logger.warn('Tentativa de acesso a empresa inexistente', {
        ip: req.ip,
        slug,
        url: req.url,
        method: req.method
      });

      if (req.xhr || req.path.startsWith('/api/')) {
        return res.status(404).json({
          success: false,
          error: 'Empresa não encontrada',
          details: 'A empresa solicitada não existe'
        });
      }

      return res.status(404).render('404');
    }

    // Adiciona a empresa ao request para uso posterior
    req.empresa = empresas[slug];
    next();
  } catch (error) {
    logger.error('Erro ao verificar existência da empresa', error, {
      ip: req.ip,
      url: req.url,
      method: req.method
    });
    
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      details: 'Erro ao verificar empresa'
    });
  }
}

// Middleware para verificar se o colaborador existe
async function requireColaboradorExists(req, res, next) {
  try {
    const { slug, id } = req.params;
    
    if (!slug || !id) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros inválidos',
        details: 'Slug da empresa e ID do colaborador são obrigatórios'
      });
    }

    const colaborador = await storage.getColaboradorById(slug, id);
    
    if (!colaborador) {
      logger.warn('Tentativa de acesso a colaborador inexistente', {
        ip: req.ip,
        slug,
        id,
        url: req.url,
        method: req.method
      });

      return res.status(404).json({
        success: false,
        error: 'Colaborador não encontrado',
        details: 'O colaborador solicitado não existe'
      });
    }

    // Adiciona o colaborador ao request para uso posterior
    req.colaborador = colaborador;
    next();
  } catch (error) {
    logger.error('Erro ao verificar existência do colaborador', error, {
      ip: req.ip,
      url: req.url,
      method: req.method
    });
    
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      details: 'Erro ao verificar colaborador'
    });
  }
}

module.exports = {
  requireAuth,
  requireSuperAdmin,
  requireEmpresaAuth,
  requireEmpresaExists,
  requireColaboradorExists,
  authenticateEmpresa,
  authenticateSuperAdmin,
  generateToken,
  verifyToken,
  rateLimit
};
