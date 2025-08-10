const config = require('../config/config');

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// Validação de CPF
function validarCPF(cpf) {
  if (!cpf) return false;
  
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digito1 = resto < 2 ? 0 : resto;
  
  if (parseInt(cpf.charAt(9)) !== digito1) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digito2 = resto < 2 ? 0 : resto;
  
  return parseInt(cpf.charAt(10)) === digito2;
}

// Validação de RG
function validarRG(rg) {
  if (!rg) return false;
  
  // Remove caracteres não numéricos
  rg = rg.replace(/\D/g, '');
  
  // RG deve ter entre 8 e 12 dígitos
  return rg.length >= 8 && rg.length <= 12;
}

// Validação de data
function validarData(data) {
  if (!data) return false;
  
  const dataObj = new Date(data);
  const hoje = new Date();
  
  // Data não pode ser no futuro
  if (dataObj > hoje) return false;
  
  // Data não pode ser muito antiga (antes de 1900)
  const dataMinima = new Date('1900-01-01');
  if (dataObj < dataMinima) return false;
  
  return !isNaN(dataObj.getTime());
}

// Validação de nome
function validarNome(nome) {
  if (!nome || typeof nome !== 'string') return false;
  
  // Remove espaços extras
  nome = nome.trim();
  
  // Nome deve ter pelo menos 2 caracteres
  if (nome.length < 2) return false;
  
  // Nome não pode exceder o limite
  if (nome.length > config.validation.maxNomeLength) return false;
  
  // Nome deve conter apenas letras, espaços e acentos
  const regexNome = /^[a-zA-ZÀ-ÿ\s]+$/;
  return regexNome.test(nome);
}

// Validação de matrícula
function validarMatricula(matricula) {
  if (!matricula || typeof matricula !== 'string') return false;
  
  matricula = matricula.trim();
  
  // Matrícula deve ter pelo menos 1 caractere
  if (matricula.length < 1) return false;
  
  // Matrícula não pode exceder o limite
  if (matricula.length > config.validation.maxMatriculaLength) return false;
  
  return true;
}

// Validação de UF
function validarUF(uf) {
  const ufsValidas = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];
  
  return ufsValidas.includes(uf);
}

// Validação completa de colaborador
function validarColaborador(dados) {
  const erros = [];
  
  try {
    // Validação de CPF
    if (!validarCPF(dados.cpf)) {
      erros.push(new ValidationError('CPF inválido', 'cpf'));
    }
    
    // Validação de nome
    if (!validarNome(dados.nome)) {
      erros.push(new ValidationError('Nome inválido', 'nome'));
    }
    
    // Validação de RG
    if (!validarRG(dados.rg)) {
      erros.push(new ValidationError('RG inválido', 'rg'));
    }
    
    // Validação de data de nascimento
    if (!validarData(dados.dataNascimento)) {
      erros.push(new ValidationError('Data de nascimento inválida', 'dataNascimento'));
    }
    
    // Validação de data de emissão do RG
    if (!validarData(dados.dataEmissaoRg)) {
      erros.push(new ValidationError('Data de emissão do RG inválida', 'dataEmissaoRg'));
    }
    
    // Validação de data de admissão
    if (!validarData(dados.dataAdmissao)) {
      erros.push(new ValidationError('Data de admissão inválida', 'dataAdmissao'));
    }
    
    // Validação de órgão emissor
    if (!dados.orgaoEmissorRg || dados.orgaoEmissorRg.trim().length < 2) {
      erros.push(new ValidationError('Órgão emissor inválido', 'orgaoEmissorRg'));
    }
    
    // Validação de UF
    if (!validarUF(dados.ufEmissao)) {
      erros.push(new ValidationError('UF inválida', 'ufEmissao'));
    }
    
    // Validação de matrícula
    if (!validarMatricula(dados.matricula)) {
      erros.push(new ValidationError('Matrícula inválida', 'matricula'));
    }
    
    // Validação de tipo de contrato
    if (!dados.tipoContrato || dados.tipoContrato.trim().length < 2) {
      erros.push(new ValidationError('Tipo de contrato inválido', 'tipoContrato'));
    }
    
  } catch (error) {
    erros.push(new ValidationError('Erro na validação dos dados', 'geral'));
  }
  
  if (erros.length > 0) {
    throw erros;
  }
  
  return true;
}

// Validação de empresa
function validarEmpresa(dados) {
  const erros = [];
  
  try {
    // Validação de nome
    if (!validarNome(dados.nome)) {
      erros.push(new ValidationError('Nome da empresa inválido', 'nome'));
    }
    
    // Validação de slug
    if (!dados.slug || dados.slug.trim().length < 2) {
      erros.push(new ValidationError('Slug inválido', 'slug'));
    }
    
    // Slug deve conter apenas letras minúsculas, números e hífens
    const regexSlug = /^[a-z0-9-]+$/;
    if (!regexSlug.test(dados.slug)) {
      erros.push(new ValidationError('Slug deve conter apenas letras minúsculas, números e hífens', 'slug'));
    }
    
    // Validação de senha
    if (!dados.senha || dados.senha.length < 6) {
      erros.push(new ValidationError('Senha deve ter pelo menos 6 caracteres', 'senha'));
    }
    
    // Validação de cor (formato hexadecimal)
    if (dados.cor && !/^#[0-9A-F]{6}$/i.test(dados.cor)) {
      erros.push(new ValidationError('Cor deve estar no formato hexadecimal (#RRGGBB)', 'cor'));
    }
    
  } catch (error) {
    erros.push(new ValidationError('Erro na validação dos dados da empresa', 'geral'));
  }
  
  if (erros.length > 0) {
    throw erros;
  }
  
  return true;
}

module.exports = {
  validarCPF,
  validarRG,
  validarData,
  validarNome,
  validarMatricula,
  validarUF,
  validarColaborador,
  validarEmpresa,
  ValidationError
};
