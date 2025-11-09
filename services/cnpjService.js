const axios = require('axios');

/**
 * Serviço para buscar dados de CNPJ usando APIs públicas
 */
class CNPJService {
  /**
   * Busca dados completos de um CNPJ
   * @param {string} cnpj - CNPJ a ser consultado (com ou sem formatação)
   * @returns {Object} Dados da empresa
   */
  async buscarDadosCNPJ(cnpj) {
    try {
      // Remove formatação do CNPJ
      const cnpjLimpo = cnpj.replace(/\D/g, '');
      
      if (cnpjLimpo.length !== 14) {
        throw new Error('CNPJ inválido');
      }

      // Tenta buscar na BrasilAPI primeiro
      try {
        const response = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`, {
          timeout: 10000
        });
        
        return this.formatarDadosBrasilAPI(response.data);
      } catch (brasilAPIError) {
        console.log('BrasilAPI falhou, tentando ReceitaWS...');
        
        // Se BrasilAPI falhar, tenta ReceitaWS
        const response = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cnpjLimpo}`, {
          timeout: 10000
        });
        
        if (response.data.status === 'ERROR') {
          throw new Error(response.data.message || 'CNPJ não encontrado');
        }
        
        return this.formatarDadosReceitaWS(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error.message);
      throw new Error(`Erro ao buscar dados do CNPJ: ${error.message}`);
    }
  }

  /**
   * Formata dados da BrasilAPI
   */
  formatarDadosBrasilAPI(data) {
    return {
      cnpj: data.cnpj,
      razaoSocial: data.razao_social || data.nome_fantasia,
      nomeFantasia: data.nome_fantasia,
      dataAbertura: data.data_inicio_atividade,
      situacao: data.descricao_situacao_cadastral,
      naturezaJuridica: data.natureza_juridica,
      capitalSocial: data.capital_social,
      porte: data.porte,
      atividadePrincipal: data.cnae_fiscal_descricao,
      cnae: data.cnae_fiscal,
      email: data.email || 'Não disponível',
      telefone: this.formatarTelefone(data.ddd_telefone_1),
      telefone2: this.formatarTelefone(data.ddd_telefone_2),
      endereco: {
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        municipio: data.municipio,
        uf: data.uf,
        cep: data.cep
      },
      socios: (data.qsa || []).map(socio => ({
        nome: socio.nome_socio || socio.nome_representante_legal,
        qualificacao: socio.qualificacao_socio || socio.qualificacao_representante_legal,
        dataEntrada: socio.data_entrada_sociedade,
        cpfCnpj: socio.cpf_cnpj_socio || 'Não disponível',
        linkedin: null // Será preenchido posteriormente
      })),
      quantidadeFuncionarios: this.estimarFuncionariosPorPorte(data.porte),
      faturamentoEstimado: this.estimarFaturamentoPorPorte(data.porte, data.capital_social),
      fonte: 'BrasilAPI'
    };
  }

  /**
   * Formata dados da ReceitaWS
   */
  formatarDadosReceitaWS(data) {
    return {
      cnpj: data.cnpj,
      razaoSocial: data.nome,
      nomeFantasia: data.fantasia,
      dataAbertura: data.abertura,
      situacao: data.situacao,
      naturezaJuridica: data.natureza_juridica,
      capitalSocial: data.capital_social,
      porte: data.porte,
      atividadePrincipal: data.atividade_principal?.[0]?.text,
      cnae: data.atividade_principal?.[0]?.code,
      email: data.email || 'Não disponível',
      telefone: data.telefone,
      telefone2: data.telefone_alternativo || null,
      endereco: {
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        municipio: data.municipio,
        uf: data.uf,
        cep: data.cep
      },
      socios: (data.qsa || []).map(socio => ({
        nome: socio.nome,
        qualificacao: socio.qual,
        dataEntrada: null,
        cpfCnpj: 'Não disponível',
        linkedin: null
      })),
      quantidadeFuncionarios: this.estimarFuncionariosPorPorte(data.porte),
      faturamentoEstimado: this.estimarFaturamentoPorPorte(data.porte, data.capital_social),
      fonte: 'ReceitaWS'
    };
  }

  /**
   * Formata telefone
   */
  formatarTelefone(telefone) {
    if (!telefone) return null;
    const tel = telefone.replace(/\D/g, '');
    if (tel.length === 10) {
      return `(${tel.substr(0, 2)}) ${tel.substr(2, 4)}-${tel.substr(6)}`;
    } else if (tel.length === 11) {
      return `(${tel.substr(0, 2)}) ${tel.substr(2, 5)}-${tel.substr(7)}`;
    }
    return telefone;
  }

  /**
   * Estima quantidade de funcionários baseado no porte
   */
  estimarFuncionariosPorPorte(porte) {
    const ranges = {
      'ME': '1-19 funcionários',
      'EPP': '20-99 funcionários',
      'DEMAIS': '100+ funcionários',
      'MICROEMPRESA': '1-19 funcionários',
      'EMPRESA DE PEQUENO PORTE': '20-99 funcionários',
      'EMPRESA DE MEDIO PORTE': '100-499 funcionários',
      'EMPRESA DE GRANDE PORTE': '500+ funcionários'
    };
    
    return ranges[porte] || 'Não disponível';
  }

  /**
   * Estima faturamento baseado no porte e capital social
   */
  estimarFaturamentoPorPorte(porte, capitalSocial) {
    const ranges = {
      'ME': 'Até R$ 360 mil/ano',
      'EPP': 'R$ 360 mil - R$ 4,8 milhões/ano',
      'MICROEMPRESA': 'Até R$ 360 mil/ano',
      'EMPRESA DE PEQUENO PORTE': 'R$ 360 mil - R$ 4,8 milhões/ano',
      'DEMAIS': 'Acima de R$ 4,8 milhões/ano'
    };
    
    return ranges[porte] || 'Não disponível';
  }

  /**
   * Busca LinkedIn de uma pessoa (simulado - API real do LinkedIn requer autenticação OAuth)
   */
  async buscarLinkedIn(nome) {
    // Esta é uma simulação. A API real do LinkedIn requer autenticação OAuth complexa
    // Em produção, você pode usar serviços como:
    // - Proxycurl
    // - RocketReach
    // - Hunter.io
    
    try {
      // Gera URL de busca do LinkedIn
      const nomeLimpo = nome.trim().replace(/\s+/g, '+');
      return `https://www.linkedin.com/search/results/people/?keywords=${nomeLimpo}`;
    } catch (error) {
      return null;
    }
  }

  /**
   * Processa múltiplos CNPJs
   */
  async buscarMultiplosCNPJs(cnpjs) {
    const resultados = [];
    
    for (const cnpj of cnpjs) {
      try {
        const dados = await this.buscarDadosCNPJ(cnpj);
        
        // Adiciona links do LinkedIn para sócios
        for (const socio of dados.socios) {
          socio.linkedin = await this.buscarLinkedIn(socio.nome);
        }
        
        resultados.push({
          sucesso: true,
          cnpj: cnpj,
          dados: dados
        });
        
        // Delay entre requisições para não sobrecarregar as APIs
        await this.delay(1000);
      } catch (error) {
        resultados.push({
          sucesso: false,
          cnpj: cnpj,
          erro: error.message
        });
      }
    }
    
    return resultados;
  }

  /**
   * Helper para delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new CNPJService();
