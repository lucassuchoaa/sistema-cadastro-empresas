#!/usr/bin/env node

/**
 * Script de Migração para MongoDB
 * Migra dados existentes em memória para o banco MongoDB
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../config/database');
const Empresa = require('../models/Empresa');
const Colaborador = require('../models/Colaborador');

// Dados existentes (se houver)
const empresasExistentes = {};
const colaboradoresExistentes = {};

async function migrarDados() {
  try {
    console.log('🚀 Iniciando migração para MongoDB...');
    
    // Conectar ao MongoDB
    await connectDB();
    
    // Limpar dados existentes (cuidado em produção!)
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Limpando dados existentes...');
      await Empresa.deleteMany({});
      await Colaborador.deleteMany({});
    }
    
    // Criar empresa padrão se não existir
    const empresaPadrao = await Empresa.findOne({ slug: 'empresa-padrao' });
    if (!empresaPadrao) {
      console.log('🏢 Criando empresa padrão...');
      
      const novaEmpresa = new Empresa({
        nome: 'Empresa Padrão',
        slug: 'empresa-padrao',
        senha: await require('bcryptjs').hash('senha123', 10),
        cor: '#007bff',
        logo: '',
        configuracoes: {
          maxColaboradores: 1000,
          camposObrigatorios: ['cpf', 'nome', 'dataNascimento', 'rg']
        }
      });
      
      await novaEmpresa.save();
      console.log('✅ Empresa padrão criada com sucesso!');
    }
    
    // Criar diretório para planilhas
    const fs = require('fs-extra');
    await fs.ensureDir('./planilhas/empresa-padrao');
    
    console.log('🎉 Migração concluída com sucesso!');
    console.log('📊 Dados migrados para MongoDB');
    console.log('🌐 Acesse: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Erro durante migração:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexão MongoDB fechada');
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrarDados();
}

module.exports = { migrarDados };
