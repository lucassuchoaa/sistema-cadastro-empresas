const fs = require('fs-extra');
const path = require('path');
const config = require('../config/config');

class Logger {
  constructor() {
    this.logsDir = path.join(__dirname, '..', 'logs');
    this.initializeLogger();
  }

  // Inicializa o sistema de logging
  async initializeLogger() {
    try {
      await fs.ensureDir(this.logsDir);
      
      // Cria arquivo de log atual
      const hoje = new Date().toISOString().split('T')[0];
      this.currentLogFile = path.join(this.logsDir, `app-${hoje}.log`);
      
      console.log('✅ Sistema de logging inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar sistema de logging:', error);
    }
  }

  // Formata a mensagem de log
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
    
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
  }

  // Escreve no arquivo de log
  async writeToFile(message) {
    try {
      const hoje = new Date().toISOString().split('T')[0];
      const logFile = path.join(this.logsDir, `app-${hoje}.log`);
      
      await fs.appendFile(logFile, message + '\n');
    } catch (error) {
      console.error('❌ Erro ao escrever no arquivo de log:', error);
    }
  }

  // Log de informação
  info(message, meta = {}) {
    const logMessage = this.formatMessage('INFO', message, meta);
    console.log(logMessage);
    this.writeToFile(logMessage);
  }

  // Log de sucesso
  success(message, meta = {}) {
    const logMessage = this.formatMessage('SUCCESS', message, meta);
    console.log(`✅ ${logMessage}`);
    this.writeToFile(logMessage);
  }

  // Log de aviso
  warn(message, meta = {}) {
    const logMessage = this.formatMessage('WARN', message, meta);
    console.warn(`⚠️  ${logMessage}`);
    this.writeToFile(logMessage);
  }

  // Log de erro
  error(message, error = null, meta = {}) {
    let errorDetails = '';
    if (error) {
      errorDetails = ` | Error: ${error.message} | Stack: ${error.stack}`;
    }
    
    const logMessage = this.formatMessage('ERROR', message + errorDetails, meta);
    console.error(`❌ ${logMessage}`);
    this.writeToFile(logMessage);
  }

  // Log de debug (apenas em desenvolvimento)
  debug(message, meta = {}) {
    if (config.server.env === 'development') {
      const logMessage = this.formatMessage('DEBUG', message, meta);
      console.log(`🐛 ${logMessage}`);
      this.writeToFile(logMessage);
    }
  }

  // Log de requisição HTTP
  http(method, url, statusCode, responseTime, meta = {}) {
    const message = `${method} ${url} - ${statusCode} (${responseTime}ms)`;
    const logMessage = this.formatMessage('HTTP', message, meta);
    
    if (statusCode >= 400) {
      console.warn(`⚠️  ${logMessage}`);
    } else {
      console.log(logMessage);
    }
    
    this.writeToFile(logMessage);
  }

  // Log de autenticação
  auth(action, user, success, meta = {}) {
    const status = success ? 'SUCCESS' : 'FAILED';
    const message = `Authentication ${action} ${status} for user: ${user}`;
    const logMessage = this.formatMessage('AUTH', message, meta);
    
    if (success) {
      console.log(`🔐 ${logMessage}`);
    } else {
      console.warn(`🔐 ${logMessage}`);
    }
    
    this.writeToFile(logMessage);
  }

  // Log de operações de dados
  data(operation, entity, id, success, meta = {}) {
    const status = success ? 'SUCCESS' : 'FAILED';
    const message = `Data ${operation} ${status} - Entity: ${entity}, ID: ${id}`;
    const logMessage = this.formatMessage('DATA', message, meta);
    
    if (success) {
      console.log(`💾 ${logMessage}`);
    } else {
      console.error(`💾 ${logMessage}`);
    }
    
    this.writeToFile(logMessage);
  }

  // Log de segurança
  security(event, details, meta = {}) {
    const message = `Security event: ${event} - ${details}`;
    const logMessage = this.formatMessage('SECURITY', message, meta);
    
    console.warn(`🔒 ${logMessage}`);
    this.writeToFile(logMessage);
  }

  // Log de performance
  performance(operation, duration, meta = {}) {
    const message = `Performance: ${operation} took ${duration}ms`;
    const logMessage = this.formatMessage('PERFORMANCE', message, meta);
    
    if (duration > 1000) {
      console.warn(`⏱️  ${logMessage}`);
    } else {
      console.log(`⏱️  ${logMessage}`);
    }
    
    this.writeToFile(logMessage);
  }

  // Log de sistema
  system(event, details, meta = {}) {
    const message = `System event: ${event} - ${details}`;
    const logMessage = this.formatMessage('SYSTEM', message, meta);
    
    console.log(`⚙️  ${logMessage}`);
    this.writeToFile(logMessage);
  }

  // Limpa logs antigos (mantém apenas os últimos 30 dias)
  async cleanOldLogs() {
    try {
      const files = await fs.readdir(this.logsDir);
      const hoje = new Date();
      
      for (const file of files) {
        if (file.startsWith('app-') && file.endsWith('.log')) {
          const filePath = path.join(this.logsDir, file);
          const stats = await fs.stat(filePath);
          const fileAge = hoje - stats.mtime;
          const diasAntigos = 30 * 24 * 60 * 60 * 1000; // 30 dias
          
          if (fileAge > diasAntigos) {
            await fs.remove(filePath);
            this.info(`Log antigo removido: ${file}`);
          }
        }
      }
    } catch (error) {
      this.error('Erro ao limpar logs antigos', error);
    }
  }

  // Obtém estatísticas dos logs
  async getLogStats() {
    try {
      const files = await fs.readdir(this.logsDir);
      const logFiles = files.filter(file => file.startsWith('app-') && file.endsWith('.log'));
      
      let totalLines = 0;
      let totalSize = 0;
      
      for (const file of logFiles) {
        const filePath = path.join(this.logsDir, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
        
        const content = await fs.readFile(filePath, 'utf8');
        totalLines += content.split('\n').length - 1; // -1 para não contar linha vazia
      }
      
      return {
        totalFiles: logFiles.length,
        totalLines,
        totalSize: this.formatBytes(totalSize),
        oldestFile: logFiles.length > 0 ? logFiles[0] : null,
        newestFile: logFiles.length > 0 ? logFiles[logFiles.length - 1] : null
      };
    } catch (error) {
      this.error('Erro ao obter estatísticas dos logs', error);
      return null;
    }
  }

  // Formata bytes para legibilidade
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Middleware para Express
  middleware() {
    return (req, res, next) => {
      const start = Date.now();
      
      // Log da requisição
      this.http(req.method, req.url, null, null, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer')
      });
      
      // Log da resposta
      res.on('finish', () => {
        const duration = Date.now() - start;
        this.http(req.method, req.url, res.statusCode, duration, {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          referer: req.get('Referer')
        });
      });
      
      next();
    };
  }
}

module.exports = new Logger();
