const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs-extra');

/**
 * Serviço para manipulação de arquivos Excel
 */
class ExcelService {
  /**
   * Cria planilha modelo para upload
   */
  async criarPlanilhaModelo() {
    const dadosModelo = [
      { CNPJ: '00000000000191' },
      { CNPJ: '00000000000000' }
    ];

    const ws = XLSX.utils.json_to_sheet(dadosModelo);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CNPJs');

    // Define largura das colunas
    ws['!cols'] = [{ wch: 20 }];

    const filePath = path.join(__dirname, '../planilhas/modelo_cnpj.xlsx');
    await fs.ensureDir(path.dirname(filePath));
    XLSX.writeFile(wb, filePath);

    return filePath;
  }

  /**
   * Lê CNPJs de uma planilha
   */
  async lerCNPJsDaPlanilha(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      // Extrai CNPJs (aceita diferentes nomes de coluna)
      const cnpjs = data.map(row => {
        const cnpj = row.CNPJ || row.cnpj || row.Cnpj || 
                     row['CNPJ/CPF'] || row.Documento || row.documento;
        
        if (cnpj) {
          return String(cnpj).replace(/\D/g, '');
        }
        return null;
      }).filter(cnpj => cnpj && cnpj.length === 14);

      return cnpjs;
    } catch (error) {
      console.error('Erro ao ler planilha:', error);
      throw new Error('Erro ao processar planilha. Verifique o formato.');
    }
  }

  /**
   * Exporta resultados para Excel
   */
  async exportarParaExcel(resultados) {
    try {
      const dadosExportacao = [];

      for (const resultado of resultados) {
        if (resultado.sucesso && resultado.dados) {
          const dados = resultado.dados;
          
          // Linha principal da empresa
          const linhaEmpresa = {
            'CNPJ': dados.cnpj,
            'Razão Social': dados.razaoSocial,
            'Nome Fantasia': dados.nomeFantasia,
            'Data Abertura': dados.dataAbertura,
            'Situação': dados.situacao,
            'Porte': dados.porte,
            'Natureza Jurídica': dados.naturezaJuridica,
            'Capital Social': dados.capitalSocial,
            'CNAE': dados.cnae,
            'Atividade Principal': dados.atividadePrincipal,
            'E-mail': dados.email,
            'Telefone': dados.telefone,
            'Telefone 2': dados.telefone2 || '',
            'CEP': dados.endereco?.cep,
            'Logradouro': dados.endereco?.logradouro,
            'Número': dados.endereco?.numero,
            'Complemento': dados.endereco?.complemento || '',
            'Bairro': dados.endereco?.bairro,
            'Município': dados.endereco?.municipio,
            'UF': dados.endereco?.uf,
            'Quantidade Funcionários': dados.quantidadeFuncionarios,
            'Faturamento Estimado': dados.faturamentoEstimado,
            'Sócio/Representante': '',
            'Qualificação': '',
            'CPF/CNPJ Sócio': '',
            'Data Entrada Sociedade': '',
            'LinkedIn': ''
          };

          dadosExportacao.push(linhaEmpresa);

          // Adiciona linhas para cada sócio
          if (dados.socios && dados.socios.length > 0) {
            dados.socios.forEach(socio => {
              dadosExportacao.push({
                'CNPJ': dados.cnpj,
                'Razão Social': dados.razaoSocial,
                'Nome Fantasia': '',
                'Data Abertura': '',
                'Situação': '',
                'Porte': '',
                'Natureza Jurídica': '',
                'Capital Social': '',
                'CNAE': '',
                'Atividade Principal': '',
                'E-mail': '',
                'Telefone': '',
                'Telefone 2': '',
                'CEP': '',
                'Logradouro': '',
                'Número': '',
                'Complemento': '',
                'Bairro': '',
                'Município': '',
                'UF': '',
                'Quantidade Funcionários': '',
                'Faturamento Estimado': '',
                'Sócio/Representante': socio.nome,
                'Qualificação': socio.qualificacao,
                'CPF/CNPJ Sócio': socio.cpfCnpj,
                'Data Entrada Sociedade': socio.dataEntrada || '',
                'LinkedIn': socio.linkedin || ''
              });
            });
          }
        } else {
          // Adiciona linha com erro
          dadosExportacao.push({
            'CNPJ': resultado.cnpj,
            'Razão Social': 'ERRO',
            'Nome Fantasia': resultado.erro || 'Erro ao buscar dados',
            'Data Abertura': '',
            'Situação': '',
            'Porte': '',
            'Natureza Jurídica': '',
            'Capital Social': '',
            'CNAE': '',
            'Atividade Principal': '',
            'E-mail': '',
            'Telefone': '',
            'Telefone 2': '',
            'CEP': '',
            'Logradouro': '',
            'Número': '',
            'Complemento': '',
            'Bairro': '',
            'Município': '',
            'UF': '',
            'Quantidade Funcionários': '',
            'Faturamento Estimado': '',
            'Sócio/Representante': '',
            'Qualificação': '',
            'CPF/CNPJ Sócio': '',
            'Data Entrada Sociedade': '',
            'LinkedIn': ''
          });
        }
      }

      // Cria planilha
      const ws = XLSX.utils.json_to_sheet(dadosExportacao);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Dados CNPJs');

      // Define largura das colunas
      ws['!cols'] = [
        { wch: 18 }, // CNPJ
        { wch: 40 }, // Razão Social
        { wch: 30 }, // Nome Fantasia
        { wch: 12 }, // Data Abertura
        { wch: 15 }, // Situação
        { wch: 15 }, // Porte
        { wch: 30 }, // Natureza Jurídica
        { wch: 15 }, // Capital Social
        { wch: 10 }, // CNAE
        { wch: 40 }, // Atividade Principal
        { wch: 30 }, // E-mail
        { wch: 18 }, // Telefone
        { wch: 18 }, // Telefone 2
        { wch: 10 }, // CEP
        { wch: 30 }, // Logradouro
        { wch: 8 },  // Número
        { wch: 20 }, // Complemento
        { wch: 20 }, // Bairro
        { wch: 20 }, // Município
        { wch: 4 },  // UF
        { wch: 25 }, // Quantidade Funcionários
        { wch: 30 }, // Faturamento Estimado
        { wch: 40 }, // Sócio/Representante
        { wch: 30 }, // Qualificação
        { wch: 18 }, // CPF/CNPJ Sócio
        { wch: 20 }, // Data Entrada Sociedade
        { wch: 50 }  // LinkedIn
      ];

      // Salva arquivo
      const timestamp = new Date().getTime();
      const fileName = `consulta_cnpj_${timestamp}.xlsx`;
      const filePath = path.join(__dirname, '../planilhas/exports', fileName);
      
      await fs.ensureDir(path.dirname(filePath));
      XLSX.writeFile(wb, filePath);

      return { filePath, fileName };
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      throw new Error('Erro ao gerar arquivo Excel');
    }
  }
}

module.exports = new ExcelService();
