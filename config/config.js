require('dotenv').config();

module.exports = {
  // Configurações do servidor
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development'
  },
  
  // Configurações de segurança
  security: {
    jwtSecret: process.env.JWT_SECRET || 'change_this_in_production',
    sessionSecret: process.env.SESSION_SECRET || 'change_this_in_production',
    bcryptRounds: 12
  },
  
  // Configurações de arquivos
  files: {
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    planilhasDir: process.env.PLANILHAS_DIR || 'planilhas',
    maxFileSize: 5 * 1024 * 1024 // 5MB
  },
  
  // Configurações de sessão
  session: {
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
  },
  
  // Configurações de validação
  validation: {
    maxNomeLength: 100,
    maxCpfLength: 14,
    maxRgLength: 20,
    maxMatriculaLength: 20
  }
};
