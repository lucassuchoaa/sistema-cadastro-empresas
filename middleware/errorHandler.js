const logger = require('../utils/logger');
const { ValidationError } = require('../utils/validation');

// Middleware para capturar erros de validação
function validationErrorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    logger.warn('Erro de validação detectado', {
      field: err.field,
      message: err.message,
      url: req.url,
      method: req.method,
      ip: req.ip
    });

    return res.status(400).json({
      success: false,
      error: 'Erro de validação',
      details: err.message,
      field: err.field
    });
  }

  next(err);
}

// Middleware para capturar erros de sintaxe JSON
function jsonErrorHandler(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logger.warn('Erro de sintaxe JSON', {
      url: req.url,
      method: req.method,
      ip: req.ip,
      error: err.message
    });

    return res.status(400).json({
      success: false,
      error: 'JSON inválido',
      details: 'O corpo da requisição contém JSON malformado'
    });
  }

  next(err);
}

// Middleware para capturar erros de limite de tamanho
function limitErrorHandler(err, req, res, next) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    logger.warn('Arquivo muito grande', {
      url: req.url,
      method: req.method,
      ip: req.ip,
      fileSize: req.file?.size
    });

    return res.status(413).json({
      success: false,
      error: 'Arquivo muito grande',
      details: 'O arquivo enviado excede o tamanho máximo permitido'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    logger.warn('Campo de arquivo inesperado', {
      url: req.url,
      method: req.method,
      ip: req.ip,
      field: err.field
    });

    return res.status(400).json({
      success: false,
      error: 'Campo de arquivo inesperado',
      details: `O campo '${err.field}' não é esperado`
    });
  }

  next(err);
}

// Middleware para capturar erros de autenticação
function authErrorHandler(err, req, res, next) {
  if (err.name === 'UnauthorizedError' || err.status === 401) {
    logger.warn('Tentativa de acesso não autorizado', {
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.status(401).json({
      success: false,
      error: 'Não autorizado',
      details: 'Token de autenticação inválido ou expirado'
    });
  }

  next(err);
}

// Middleware para capturar erros de permissão
function permissionErrorHandler(err, req, res, next) {
  if (err.status === 403) {
    logger.warn('Tentativa de acesso negado', {
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.status(403).json({
      success: false,
      error: 'Acesso negado',
      details: 'Você não tem permissão para acessar este recurso'
    });
  }

  next(err);
}

// Middleware para capturar erros de não encontrado
function notFoundErrorHandler(err, req, res, next) {
  if (err.status === 404) {
    logger.warn('Recurso não encontrado', {
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.status(404).json({
      success: false,
      error: 'Não encontrado',
      details: 'O recurso solicitado não foi encontrado'
    });
  }

  next(err);
}

// Middleware para capturar erros de rate limiting
function rateLimitErrorHandler(err, req, res, next) {
  if (err.status === 429) {
    logger.warn('Rate limit excedido', {
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.status(429).json({
      success: false,
      error: 'Muitas requisições',
      details: 'Você excedeu o limite de requisições. Tente novamente mais tarde.'
    });
  }

  next(err);
}

// Middleware para capturar erros de timeout
function timeoutErrorHandler(err, req, res, next) {
  if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT') {
    logger.error('Timeout na requisição', {
      url: req.url,
      method: req.method,
      ip: req.ip,
      error: err.message
    });

    return res.status(408).json({
      success: false,
      error: 'Timeout',
      details: 'A requisição demorou muito para ser processada'
    });
  }

  next(err);
}

// Middleware para capturar erros de conexão
function connectionErrorHandler(err, req, res, next) {
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    logger.error('Erro de conexão', {
      url: req.url,
      method: req.method,
      ip: req.ip,
      error: err.message
    });

    return res.status(503).json({
      success: false,
      error: 'Serviço indisponível',
      details: 'Não foi possível conectar ao serviço solicitado'
    });
  }

  next(err);
}

// Middleware para capturar erros genéricos
function genericErrorHandler(err, req, res, next) {
  // Log do erro
  logger.error('Erro interno do servidor', err, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Em desenvolvimento, retorna detalhes do erro
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: err.message,
      stack: err.stack
    });
  }

  // Em produção, retorna mensagem genérica
  return res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    details: 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
  });
}

// Middleware para capturar erros não tratados
function unhandledErrorHandler(err, req, res, next) {
  // Log do erro não tratado
  logger.error('Erro não tratado', err, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Resposta genérica
  return res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    details: 'Ocorreu um erro inesperado'
  });
}

// Middleware para capturar erros de validação de dados
function dataValidationErrorHandler(err, req, res, next) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    logger.warn('Erro de validação de dados', {
      url: req.url,
      method: req.method,
      ip: req.ip,
      error: err.message
    });

    return res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      details: 'Os dados fornecidos não são válidos'
    });
  }

  next(err);
}

// Middleware para capturar erros de arquivo
function fileErrorHandler(err, req, res, next) {
  if (err.code === 'ENOENT') {
    logger.warn('Arquivo não encontrado', {
      url: req.url,
      method: req.method,
      ip: req.ip,
      error: err.message
    });

    return res.status(404).json({
      success: false,
      error: 'Arquivo não encontrado',
      details: 'O arquivo solicitado não foi encontrado'
    });
  }

  if (err.code === 'EACCES') {
    logger.warn('Permissão negada para arquivo', {
      url: req.url,
      method: req.method,
      ip: req.ip,
      error: err.message
    });

    return res.status(403).json({
      success: false,
      error: 'Permissão negada',
      details: 'Não é possível acessar o arquivo solicitado'
    });
  }

  next(err);
}

// Função para registrar todos os middlewares de erro
function registerErrorHandlers(app) {
  // Middlewares de erro específicos (ordem específica)
  app.use(validationErrorHandler);
  app.use(jsonErrorHandler);
  app.use(limitErrorHandler);
  app.use(authErrorHandler);
  app.use(permissionErrorHandler);
  app.use(notFoundErrorHandler);
  app.use(rateLimitErrorHandler);
  app.use(timeoutErrorHandler);
  app.use(connectionErrorHandler);
  app.use(dataValidationErrorHandler);
  app.use(fileErrorHandler);
  
  // Middleware genérico (deve ser o último)
  app.use(genericErrorHandler);
  
  // Middleware para erros não tratados (fallback)
  app.use(unhandledErrorHandler);
}

// Middleware para capturar erros assíncronos
function asyncErrorHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Middleware para validação de entrada
function validateInput(schema) {
  return (req, res, next) => {
    try {
      if (schema.body) {
        const { error } = schema.body.validate(req.body);
        if (error) {
          throw new ValidationError(error.details[0].message, 'body');
        }
      }

      if (schema.params) {
        const { error } = schema.params.validate(req.params);
        if (error) {
          throw new ValidationError(error.details[0].message, 'params');
        }
      }

      if (schema.query) {
        const { error } = schema.query.validate(req.query);
        if (error) {
          throw new ValidationError(error.details[0].message, 'query');
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  registerErrorHandlers,
  asyncErrorHandler,
  validateInput,
  ValidationError
};
