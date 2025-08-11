const mongoose = require('mongoose');

const colaboradorSchema = new mongoose.Schema({
  empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: [true, 'Empresa é obrigatória'],
    index: true
  },
  cpf: {
    type: String,
    required: [true, 'CPF é obrigatório'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Remove caracteres não numéricos
        const cpfLimpo = v.replace(/\D/g, '');
        return cpfLimpo.length === 11;
      },
      message: 'CPF deve conter 11 dígitos'
    }
  },
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  dataNascimento: {
    type: Date,
    required: [true, 'Data de nascimento é obrigatória'],
    validate: {
      validator: function(v) {
        const hoje = new Date();
        const idade = hoje.getFullYear() - v.getFullYear();
        return idade >= 14 && idade <= 100; // Idade entre 14 e 100 anos
      },
      message: 'Data de nascimento inválida (idade deve ser entre 14 e 100 anos)'
    }
  },
  rg: {
    type: String,
    required: [true, 'RG é obrigatório'],
    trim: true,
    maxlength: [20, 'RG não pode ter mais de 20 caracteres']
  },
  dataEmissaoRg: {
    type: Date,
    required: [true, 'Data de emissão do RG é obrigatória'],
    validate: {
      validator: function(v) {
        return v <= new Date(); // Data não pode ser futura
      },
      message: 'Data de emissão do RG não pode ser futura'
    }
  },
  orgaoEmissorRg: {
    type: String,
    required: [true, 'Órgão emissor do RG é obrigatório'],
    trim: true,
    maxlength: [10, 'Órgão emissor não pode ter mais de 10 caracteres']
  },
  ufEmissao: {
    type: String,
    required: [true, 'UF de emissão é obrigatória'],
    enum: {
      values: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'],
      message: 'UF deve ser um estado válido do Brasil'
    }
  },
  dataAdmissao: {
    type: Date,
    required: false, // Campo opcional
    validate: {
      validator: function(v) {
        if (!v) return true; // Campo opcional
        return v <= new Date(); // Data não pode ser futura
      },
      message: 'Data de admissão não pode ser futura'
    }
  },
  status: {
    type: String,
    enum: ['ativo', 'inativo', 'pendente'],
    default: 'ativo'
  },
  dataRegistro: {
    type: Date,
    default: Date.now
  },
  ultimaAtualizacao: {
    type: Date,
    default: Date.now
  },
  observacoes: {
    type: String,
    maxlength: [500, 'Observações não podem ter mais de 500 caracteres']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para performance
colaboradorSchema.index({ empresa: 1, cpf: 1 });
colaboradorSchema.index({ empresa: 1, dataRegistro: -1 });
colaboradorSchema.index({ empresa: 1, status: 1 });
colaboradorSchema.index({ cpf: 1 }, { unique: true });

// Virtual para calcular idade
colaboradorSchema.virtual('idade').get(function() {
  if (!this.dataNascimento) return null;
  const hoje = new Date();
  const nascimento = new Date(this.dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
});

// Virtual para tempo de empresa
colaboradorSchema.virtual('tempoEmpresa').get(function() {
  if (!this.dataAdmissao) return null;
  const hoje = new Date();
  const admissao = new Date(this.dataAdmissao);
  const diffTime = Math.abs(hoje - admissao);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Middleware para atualizar última atualização
colaboradorSchema.pre('save', function(next) {
  this.ultimaAtualizacao = new Date();
  next();
});

// Middleware para validar CPF único por empresa
colaboradorSchema.pre('save', async function(next) {
  if (this.isModified('cpf') || this.isModified('empresa')) {
    const Colaborador = mongoose.model('Colaborador');
    const existing = await Colaborador.findOne({
      cpf: this.cpf,
      empresa: this.empresa,
      _id: { $ne: this._id }
    });
    
    if (existing) {
      const error = new Error('CPF já cadastrado nesta empresa');
      return next(error);
    }
  }
  next();
});

// Método para ativar/desativar colaborador
colaboradorSchema.methods.alterarStatus = function(novoStatus) {
  this.status = novoStatus;
  this.ultimaAtualizacao = new Date();
  return this.save();
};

// Método para obter dados formatados
colaboradorSchema.methods.getDadosFormatados = function() {
  return {
    id: this._id,
    cpf: this.cpf,
    nome: this.nome,
    idade: this.idade,
    rg: this.rg,
    dataAdmissao: this.dataAdmissao ? this.dataAdmissao.toLocaleDateString('pt-BR') : 'Não informado',
    tempoEmpresa: this.tempoEmpresa ? `${this.tempoEmpresa} dias` : 'Não informado',
    status: this.status,
    dataRegistro: this.dataRegistro.toLocaleDateString('pt-BR')
  };
};

module.exports = mongoose.model('Colaborador', colaboradorSchema);
