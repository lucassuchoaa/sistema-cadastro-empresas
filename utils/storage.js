const fs = require('fs-extra');
const path = require('path');
const config = require('../config/config');

class StorageManager {
  constructor() {
    this.dataDir = path.join(__dirname, '..', 'data');
    this.empresasFile = path.join(this.dataDir, 'empresas.json');
    this.colaboradoresFile = path.join(this.dataDir, 'colaboradores.json');
    this.initializeStorage();
  }

  // Inicializa o sistema de armazenamento
  async initializeStorage() {
    try {
      await fs.ensureDir(this.dataDir);
      
      // Cria arquivo de empresas se não existir
      if (!await fs.pathExists(this.empresasFile)) {
        await fs.writeJson(this.empresasFile, {}, { spaces: 2 });
      }
      
      // Cria arquivo de colaboradores se não existir
      if (!await fs.pathExists(this.colaboradoresFile)) {
        await fs.writeJson(this.colaboradoresFile, {}, { spaces: 2 });
      }
      
      console.log('✅ Sistema de armazenamento inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar sistema de armazenamento:', error);
      throw error;
    }
  }

  // Carrega dados das empresas
  async loadEmpresas() {
    try {
      const data = await fs.readJson(this.empresasFile);
      return data || {};
    } catch (error) {
      console.error('❌ Erro ao carregar empresas:', error);
      return {};
    }
  }

  // Salva dados das empresas
  async saveEmpresas(empresas) {
    try {
      await fs.writeJson(this.empresasFile, empresas, { spaces: 2 });
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar empresas:', error);
      return false;
    }
  }

  // Carrega dados dos colaboradores
  async loadColaboradores() {
    try {
      const data = await fs.readJson(this.colaboradoresFile);
      return data || {};
    } catch (error) {
      console.error('❌ Erro ao carregar colaboradores:', error);
      return {};
    }
  }

  // Salva dados dos colaboradores
  async saveColaboradores(colaboradores) {
    try {
      await fs.writeJson(this.colaboradoresFile, colaboradores, { spaces: 2 });
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar colaboradores:', error);
      return false;
    }
  }

  // Adiciona uma nova empresa
  async addEmpresa(empresa) {
    try {
      const empresas = await this.loadEmpresas();
      empresas[empresa.slug] = {
        ...empresa,
        dataCriacao: new Date().toISOString(),
        ultimaAtualizacao: new Date().toISOString()
      };
      
      const success = await this.saveEmpresas(empresas);
      if (success) {
        console.log(`✅ Empresa "${empresa.nome}" adicionada com sucesso`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao adicionar empresa:', error);
      return false;
    }
  }

  // Atualiza uma empresa existente
  async updateEmpresa(slug, dados) {
    try {
      const empresas = await this.loadEmpresas();
      if (!empresas[slug]) {
        throw new Error('Empresa não encontrada');
      }
      
      empresas[slug] = {
        ...empresas[slug],
        ...dados,
        ultimaAtualizacao: new Date().toISOString()
      };
      
      const success = await this.saveEmpresas(empresas);
      if (success) {
        console.log(`✅ Empresa "${empresas[slug].nome}" atualizada com sucesso`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao atualizar empresa:', error);
      return false;
    }
  }

  // Remove uma empresa
  async removeEmpresa(slug) {
    try {
      const empresas = await this.loadEmpresas();
      if (!empresas[slug]) {
        throw new Error('Empresa não encontrada');
      }
      
      delete empresas[slug];
      
      const success = await this.saveEmpresas(empresas);
      if (success) {
        console.log(`✅ Empresa "${slug}" removida com sucesso`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao remover empresa:', error);
      return false;
    }
  }

  // Adiciona um novo colaborador
  async addColaborador(slug, colaborador) {
    try {
      const colaboradores = await this.loadColaboradores();
      
      if (!colaboradores[slug]) {
        colaboradores[slug] = [];
      }
      
      const novoColaborador = {
        ...colaborador,
        id: Date.now() + Math.random(),
        dataRegistro: new Date().toISOString()
      };
      
      colaboradores[slug].push(novoColaborador);
      
      const success = await this.saveColaboradores(colaboradores);
      if (success) {
        console.log(`✅ Colaborador "${colaborador.nome}" adicionado à empresa "${slug}"`);
        return novoColaborador;
      }
      return null;
    } catch (error) {
      console.error('❌ Erro ao adicionar colaborador:', error);
      return null;
    }
  }

  // Busca colaboradores por empresa
  async getColaboradoresByEmpresa(slug) {
    try {
      const colaboradores = await this.loadColaboradores();
      return colaboradores[slug] || [];
    } catch (error) {
      console.error('❌ Erro ao buscar colaboradores:', error);
      return [];
    }
  }

  // Busca colaborador por ID
  async getColaboradorById(slug, id) {
    try {
      const colaboradores = await this.getColaboradoresByEmpresa(slug);
      return colaboradores.find(c => c.id === id) || null;
    } catch (error) {
      console.error('❌ Erro ao buscar colaborador por ID:', error);
      return null;
    }
  }

  // Atualiza um colaborador
  async updateColaborador(slug, id, dados) {
    try {
      const colaboradores = await this.loadColaboradores();
      if (!colaboradores[slug]) {
        throw new Error('Empresa não encontrada');
      }
      
      const index = colaboradores[slug].findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Colaborador não encontrado');
      }
      
      colaboradores[slug][index] = {
        ...colaboradores[slug][index],
        ...dados,
        ultimaAtualizacao: new Date().toISOString()
      };
      
      const success = await this.saveColaboradores(colaboradores);
      if (success) {
        console.log(`✅ Colaborador "${colaboradores[slug][index].nome}" atualizado com sucesso`);
        return colaboradores[slug][index];
      }
      return null;
    } catch (error) {
      console.error('❌ Erro ao atualizar colaborador:', error);
      return null;
    }
  }

  // Remove um colaborador
  async removeColaborador(slug, id) {
    try {
      const colaboradores = await this.loadColaboradores();
      if (!colaboradores[slug]) {
        throw new Error('Empresa não encontrada');
      }
      
      const index = colaboradores[slug].findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Colaborador não encontrado');
      }
      
      const colaboradorRemovido = colaboradores[slug].splice(index, 1)[0];
      
      const success = await this.saveColaboradores(colaboradores);
      if (success) {
        console.log(`✅ Colaborador "${colaboradorRemovido.nome}" removido com sucesso`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao remover colaborador:', error);
      return false;
    }
  }

  // Busca colaboradores com filtros
  async searchColaboradores(filtros = {}) {
    try {
      const colaboradores = await this.loadColaboradores();
      let resultados = [];
      
      // Adiciona todos os colaboradores de todas as empresas
      Object.keys(colaboradores).forEach(slug => {
        colaboradores[slug].forEach(colaborador => {
          resultados.push({
            ...colaborador,
            empresaSlug: slug
          });
        });
      });
      
      // Aplica filtros
      if (filtros.empresa) {
        resultados = resultados.filter(c => c.empresaSlug === filtros.empresa);
      }
      
      if (filtros.search) {
        const termo = filtros.search.toLowerCase();
        resultados = resultados.filter(c => 
          c.nome.toLowerCase().includes(termo) ||
          c.cpf.includes(termo) ||
          c.matricula.toLowerCase().includes(termo)
        );
      }
      
      if (filtros.dataInicio) {
        const dataInicio = new Date(filtros.dataInicio);
        resultados = resultados.filter(c => new Date(c.dataRegistro) >= dataInicio);
      }
      
      if (filtros.dataFim) {
        const dataFim = new Date(filtros.dataFim);
        resultados = resultados.filter(c => new Date(c.dataRegistro) <= dataFim);
      }
      
      return resultados;
    } catch (error) {
      console.error('❌ Erro ao buscar colaboradores:', error);
      return [];
    }
  }

  // Estatísticas gerais
  async getEstatisticas() {
    try {
      const empresas = await this.loadEmpresas();
      const colaboradores = await this.loadColaboradores();
      
      const totalEmpresas = Object.keys(empresas).length;
      let totalColaboradores = 0;
      let cadastrosHoje = 0;
      
      const hoje = new Date().toDateString();
      
      Object.keys(colaboradores).forEach(slug => {
        totalColaboradores += (colaboradores[slug] || []).length;
        
        colaboradores[slug].forEach(colaborador => {
          if (new Date(colaborador.dataRegistro).toDateString() === hoje) {
            cadastrosHoje++;
          }
        });
      });
      
      return {
        totalEmpresas,
        totalColaboradores,
        cadastrosHoje,
        empresasAtivas: totalEmpresas
      };
    } catch (error) {
      console.error('❌ Erro ao gerar estatísticas:', error);
      return {
        totalEmpresas: 0,
        totalColaboradores: 0,
        cadastrosHoje: 0,
        empresasAtivas: 0
      };
    }
  }

  // Backup dos dados
  async createBackup() {
    try {
      const backupDir = path.join(this.dataDir, 'backups');
      await fs.ensureDir(backupDir);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
      
      const empresas = await this.loadEmpresas();
      const colaboradores = await this.loadColaboradores();
      
      const backup = {
        timestamp: new Date().toISOString(),
        empresas,
        colaboradores
      };
      
      await fs.writeJson(backupFile, backup, { spaces: 2 });
      console.log(`✅ Backup criado: ${backupFile}`);
      return backupFile;
    } catch (error) {
      console.error('❌ Erro ao criar backup:', error);
      return null;
    }
  }

  // Restaura backup
  async restoreBackup(backupFile) {
    try {
      const backup = await fs.readJson(backupFile);
      
      await this.saveEmpresas(backup.empresas);
      await this.saveColaboradores(backup.colaboradores);
      
      console.log(`✅ Backup restaurado: ${backupFile}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao restaurar backup:', error);
      return false;
    }
  }
}

module.exports = new StorageManager();
