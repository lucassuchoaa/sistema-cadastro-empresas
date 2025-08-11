const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome da empresa é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  slug: {
    type: String,
    required: [true, 'Slug é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres']
  },
  cor: {
    type: String,
    default: '#007bff',
    match: [/^#[0-9A-F]{6}$/i, 'Cor deve ser um código hexadecimal válido']
  },
  logo: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        if (!v) return true; // Campo opcional
        return /^https?:\/\/.+/.test(v); // Deve ser uma URL válida
      },
      message: 'Logo deve ser uma URL válida'
    }
  },
  ativo: {
    type: Boolean,
    default: true
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  ultimaAtualizacao: {
    type: Date,
    default: Date.now
  },
  configuracoes: {
    maxColaboradores: {
      type: Number,
      default: 1000
    },
    camposObrigatorios: {
      type: [String],
      default: ['cpf', 'nome', 'dataNascimento', 'rg']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para performance
empresaSchema.index({ slug: 1 });
empresaSchema.index({ ativo: 1 });
empresaSchema.index({ dataCriacao: -1 });

// Virtual para contar colaboradores
empresaSchema.virtual('totalColaboradores', {
  ref: 'Colaborador',
  localField: '_id',
  foreignField: 'empresa',
  count: true
});

// Middleware para atualizar última atualização
empresaSchema.pre('save', function(next) {
  this.ultimaAtualizacao = new Date();
  next();
});

// Método para verificar se pode receber mais colaboradores
empresaSchema.methods.podeReceberColaborador = function() {
  return this.ativo && this.totalColaboradores < this.configuracoes.maxColaboradores;
};

// Método para obter estatísticas
empresaSchema.methods.getEstatisticas = async function() {
  const Colaborador = mongoose.model('Colaborador');
  const total = await Colaborador.countDocuments({ empresa: this._id });
  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const novosEsteMes = await Colaborador.countDocuments({
    empresa: this._id,
    dataRegistro: { $gte: inicioMes }
  });
  
  return {
    totalColaboradores: total,
    novosEsteMes: novosEsteMes,
    capacidade: this.configuracoes.maxColaboradores,
    percentualOcupacao: Math.round((total / this.configuracoes.maxColaboradores) * 100)
  };
};

module.exports = mongoose.model('Empresa', empresaSchema);
