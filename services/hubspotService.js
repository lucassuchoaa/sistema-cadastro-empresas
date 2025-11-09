const axios = require('axios');

/**
 * Serviço para integração com HubSpot
 */
class HubSpotService {
  constructor() {
    this.apiKey = process.env.HUBSPOT_API_KEY;
    this.baseURL = 'https://api.hubapi.com';
  }

  /**
   * Verifica se a API key está configurada
   */
  isConfigured() {
    return !!this.apiKey;
  }

  /**
   * Busca todos os pipelines disponíveis
   */
  async buscarPipelines() {
    if (!this.isConfigured()) {
      throw new Error('HubSpot API Key não configurada');
    }

    try {
      const response = await axios.get(
        `${this.baseURL}/crm/v3/pipelines/deals`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.results.map(pipeline => ({
        id: pipeline.id,
        label: pipeline.label,
        stages: pipeline.stages.map(stage => ({
          id: stage.id,
          label: stage.label
        }))
      }));
    } catch (error) {
      console.error('Erro ao buscar pipelines:', error.response?.data || error.message);
      throw new Error('Erro ao buscar pipelines do HubSpot');
    }
  }

  /**
   * Cria uma empresa no HubSpot
   */
  async criarEmpresa(dadosEmpresa) {
    if (!this.isConfigured()) {
      throw new Error('HubSpot API Key não configurada');
    }

    try {
      const properties = {
        name: dadosEmpresa.razaoSocial,
        domain: this.extrairDominio(dadosEmpresa.email),
        city: dadosEmpresa.endereco?.municipio,
        state: dadosEmpresa.endereco?.uf,
        zip: dadosEmpresa.endereco?.cep,
        phone: dadosEmpresa.telefone,
        industry: dadosEmpresa.atividadePrincipal,
        numberofemployees: this.parseNumeroFuncionarios(dadosEmpresa.quantidadeFuncionarios),
        annualrevenue: this.parseFaturamento(dadosEmpresa.faturamentoEstimado),
        description: `Empresa consultada via CNPJ. CNAE: ${dadosEmpresa.cnae}`,
        // Campos customizados
        cnpj: dadosEmpresa.cnpj,
        data_abertura: dadosEmpresa.dataAbertura,
        situacao_cadastral: dadosEmpresa.situacao,
        natureza_juridica: dadosEmpresa.naturezaJuridica,
        porte_empresa: dadosEmpresa.porte,
        capital_social: dadosEmpresa.capitalSocial
      };

      const response = await axios.post(
        `${this.baseURL}/crm/v3/objects/companies`,
        { properties },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        id: response.data.id,
        properties: response.data.properties
      };
    } catch (error) {
      console.error('Erro ao criar empresa:', error.response?.data || error.message);
      
      // Se empresa já existe, tenta buscar
      if (error.response?.status === 409) {
        return await this.buscarEmpresaPorCNPJ(dadosEmpresa.cnpj);
      }
      
      throw new Error('Erro ao criar empresa no HubSpot');
    }
  }

  /**
   * Cria contatos (sócios) no HubSpot
   */
  async criarContatos(socios, empresaId) {
    if (!this.isConfigured()) {
      throw new Error('HubSpot API Key não configurada');
    }

    const contatosCriados = [];

    for (const socio of socios) {
      try {
        const properties = {
          firstname: socio.nome.split(' ')[0],
          lastname: socio.nome.split(' ').slice(1).join(' ') || socio.nome,
          jobtitle: socio.qualificacao,
          company: empresaId,
          linkedin_url: socio.linkedin,
          hs_lead_status: 'NEW'
        };

        const response = await axios.post(
          `${this.baseURL}/crm/v3/objects/contacts`,
          { properties },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Associa contato à empresa
        await this.associarContatoEmpresa(response.data.id, empresaId);

        contatosCriados.push({
          id: response.data.id,
          nome: socio.nome
        });
      } catch (error) {
        console.error(`Erro ao criar contato ${socio.nome}:`, error.response?.data || error.message);
        // Continua mesmo se falhar para um sócio
      }
    }

    return contatosCriados;
  }

  /**
   * Cria um negócio (deal) no HubSpot
   */
  async criarNegocio(dadosEmpresa, empresaId, pipelineId, stageId) {
    if (!this.isConfigured()) {
      throw new Error('HubSpot API Key não configurada');
    }

    try {
      const properties = {
        dealname: `Oportunidade - ${dadosEmpresa.razaoSocial}`,
        pipeline: pipelineId,
        dealstage: stageId,
        amount: this.parseFaturamentoParaNumero(dadosEmpresa.faturamentoEstimado),
        closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime(), // 30 dias
        dealtype: 'newbusiness',
        description: `Negócio criado automaticamente via consulta CNPJ.\n\nCNPJ: ${dadosEmpresa.cnpj}\nPorte: ${dadosEmpresa.porte}\nFuncionários: ${dadosEmpresa.quantidadeFuncionarios}`
      };

      const response = await axios.post(
        `${this.baseURL}/crm/v3/objects/deals`,
        { properties },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Associa negócio à empresa
      await this.associarNegocioEmpresa(response.data.id, empresaId);

      return {
        id: response.data.id,
        properties: response.data.properties
      };
    } catch (error) {
      console.error('Erro ao criar negócio:', error.response?.data || error.message);
      throw new Error('Erro ao criar negócio no HubSpot');
    }
  }

  /**
   * Associa contato à empresa
   */
  async associarContatoEmpresa(contatoId, empresaId) {
    try {
      await axios.put(
        `${this.baseURL}/crm/v3/objects/contacts/${contatoId}/associations/companies/${empresaId}/contact_to_company`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Erro ao associar contato à empresa:', error.response?.data || error.message);
    }
  }

  /**
   * Associa negócio à empresa
   */
  async associarNegocioEmpresa(negocioId, empresaId) {
    try {
      await axios.put(
        `${this.baseURL}/crm/v3/objects/deals/${negocioId}/associations/companies/${empresaId}/deal_to_company`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Erro ao associar negócio à empresa:', error.response?.data || error.message);
    }
  }

  /**
   * Busca empresa por CNPJ
   */
  async buscarEmpresaPorCNPJ(cnpj) {
    try {
      const response = await axios.post(
        `${this.baseURL}/crm/v3/objects/companies/search`,
        {
          filterGroups: [{
            filters: [{
              propertyName: 'cnpj',
              operator: 'EQ',
              value: cnpj
            }]
          }]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.results.length > 0) {
        return {
          id: response.data.results[0].id,
          properties: response.data.results[0].properties
        };
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar empresa:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Helpers
   */
  extrairDominio(email) {
    if (!email || email === 'Não disponível') return '';
    const match = email.match(/@(.+)$/);
    return match ? match[1] : '';
  }

  parseNumeroFuncionarios(texto) {
    if (!texto || texto === 'Não disponível') return 0;
    const match = texto.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  parseFaturamento(texto) {
    if (!texto || texto === 'Não disponível') return 0;
    // Extrai o valor médio da faixa
    const match = texto.match(/R\$\s*([\d,.]+)/g);
    if (match && match.length > 0) {
      const valor = match[0].replace(/[^\d,]/g, '').replace(',', '.');
      return parseFloat(valor) * 1000; // Converte para número
    }
    return 0;
  }

  parseFaturamentoParaNumero(texto) {
    if (!texto || texto === 'Não disponível') return 0;
    
    if (texto.includes('milhões')) {
      const match = texto.match(/([\d,]+)/);
      if (match) {
        return parseFloat(match[1].replace(',', '.')) * 1000000;
      }
    } else if (texto.includes('mil')) {
      const match = texto.match(/([\d,]+)/);
      if (match) {
        return parseFloat(match[1].replace(',', '.')) * 1000;
      }
    }
    
    return 360000; // Valor padrão
  }
}

module.exports = new HubSpotService();
