# 🔍 Sistema de Consulta CNPJ com Integração HubSpot

## 📋 Descrição

Landing Page completa para consulta de dados empresariais via CNPJ com integração direta ao HubSpot. O sistema permite buscar informações detalhadas de empresas brasileiras e exportar os dados para Excel ou diretamente para o HubSpot.

## ✨ Funcionalidades

### 🔎 Consulta de CNPJs

- **CNPJ Individual**: Busca dados de uma empresa por vez
- **Múltiplos CNPJs**: Busca dados de várias empresas simultaneamente
- **Upload de Planilha**: Importa CNPJs de arquivo Excel (.xlsx, .xls)
- **Modelo de Planilha**: Download de template para facilitar o upload

### 📊 Dados Coletados

Para cada CNPJ consultado, o sistema retorna:

- **Dados Cadastrais**:
  - Razão Social
  - Nome Fantasia
  - CNPJ
  - Data de Abertura
  - Situação Cadastral
  - Natureza Jurídica
  - Capital Social
  - Porte da Empresa

- **Atividade Econômica**:
  - CNAE
  - Atividade Principal
  - Quantidade de Funcionários (estimado)
  - Faturamento Estimado

- **Contato**:
  - E-mail
  - Telefones disponíveis
  - Endereço completo

- **Quadro Societário**:
  - Nome dos sócios/representantes legais
  - Qualificação
  - CPF/CNPJ do sócio
  - Data de entrada na sociedade
  - Link de busca do LinkedIn

### 📥 Exportação

#### Excel
- Exporta todos os resultados em formato Excel
- Inclui dados da empresa e sócios em linhas separadas
- Formatação profissional e pronta para análise

#### HubSpot
- Criação automática de empresas
- Criação de contatos (sócios/representantes)
- Criação de negócios em pipeline específico
- Seleção de pipeline e estágio do negócio
- Associação automática entre empresa, contatos e negócios

## 🚀 Instalação

### Dependências Instaladas

```bash
npm install axios multer @hubspot/api-client
```

### Variáveis de Ambiente

Adicione ao arquivo `.env`:

```env
# Integração HubSpot
HUBSPOT_API_KEY=your_hubspot_api_key_here
```

## 📖 Como Usar

### 1. Acessar a Landing Page

```
http://localhost:3000/cnpj
```

### 2. Consultar CNPJs

#### Opção A: CNPJ Individual
1. Clique na aba "CNPJ Individual"
2. Digite o CNPJ (com ou sem formatação)
3. Clique em "Buscar Dados"

#### Opção B: Múltiplos CNPJs
1. Clique na aba "Múltiplos CNPJs"
2. Digite os CNPJs (um por linha)
3. Clique em "Buscar Dados"

#### Opção C: Upload de Planilha
1. Clique na aba "Upload Planilha"
2. Baixe o modelo de planilha (link disponível)
3. Preencha a planilha com os CNPJs
4. Faça o upload do arquivo
5. Clique em "Processar Planilha"

### 3. Exportar Resultados

#### Para Excel
1. Após a busca, clique em "📥 Baixar Excel"
2. O arquivo será baixado automaticamente

#### Para HubSpot
1. Clique em "🚀 Exportar para HubSpot"
2. Selecione as opções desejadas:
   - ✅ Criar empresa no HubSpot
   - ✅ Criar contatos (sócios)
   - ✅ Criar negócio
3. Se criar negócio, selecione o pipeline e estágio
4. Clique em "Enviar para HubSpot"

## 🔧 APIs Disponíveis

### POST `/api/cnpj/buscar`
Busca dados de CNPJs

**Request:**
```json
{
  "cnpjs": ["00000000000191", "00000000000000"]
}
```

**Response:**
```json
{
  "success": true,
  "resultados": [...],
  "total": 2,
  "sucesso": 1,
  "erros": 1
}
```

### POST `/api/cnpj/upload`
Upload de planilha com CNPJs

**Request:** `multipart/form-data` com campo `planilha`

**Response:** Igual à rota `/api/cnpj/buscar`

### GET `/cnpj/download-modelo`
Download do modelo de planilha

### POST `/api/cnpj/exportar-excel`
Exporta resultados para Excel

**Request:**
```json
{
  "resultados": [...]
}
```

**Response:** Arquivo Excel para download

### GET `/api/hubspot/pipelines`
Busca pipelines disponíveis no HubSpot

**Response:**
```json
{
  "success": true,
  "pipelines": [
    {
      "id": "default",
      "label": "Pipeline Vendas",
      "stages": [...]
    }
  ]
}
```

### POST `/api/hubspot/exportar`
Exporta dados para o HubSpot

**Request:**
```json
{
  "resultados": [...],
  "opcoes": {
    "criarEmpresa": true,
    "criarContatos": true,
    "criarNegocio": true,
    "pipelineId": "default",
    "stageId": "appointmentscheduled"
  }
}
```

## 🔑 Obtendo API Key do HubSpot

1. Acesse sua conta HubSpot
2. Vá em Settings > Integrations > API Key
3. Clique em "Create API Key"
4. Copie a chave e adicione ao `.env`

**Importante:** A API Key do HubSpot tem limitações de rate limit. Em produção, considere usar OAuth 2.0.

## 📁 Estrutura de Arquivos

```
/workspace/
├── services/
│   ├── cnpjService.js      # Serviço de busca CNPJ
│   ├── excelService.js     # Serviço de manipulação Excel
│   └── hubspotService.js   # Serviço de integração HubSpot
├── views/
│   └── cnpj-lookup.ejs     # Landing Page
├── uploads/                 # Uploads temporários
├── planilhas/
│   ├── modelo_cnpj.xlsx    # Modelo de planilha
│   └── exports/            # Exportações geradas
└── server.js               # Rotas adicionadas
```

## 🌐 Fontes de Dados

O sistema utiliza APIs públicas gratuitas:

1. **BrasilAPI** (primária): https://brasilapi.com.br/
2. **ReceitaWS** (fallback): https://www.receitaws.com.br/

## ⚠️ Limitações

### APIs Públicas
- BrasilAPI: Pode ter rate limiting em horários de pico
- ReceitaWS: Limitação de 3 requisições por minuto

### LinkedIn
- A busca de LinkedIn retorna uma URL de pesquisa
- APIs oficiais do LinkedIn requerem OAuth e aprovação
- Para busca automática real, considere usar serviços como:
  - Proxycurl
  - RocketReach
  - Hunter.io

### Dados Estimados
- Quantidade de funcionários: Baseado no porte da empresa
- Faturamento: Estimativa baseada em porte e capital social

## 🎨 Interface

A Landing Page possui:
- Design moderno e responsivo
- Gradient roxo no background
- Cards brancos com sombras
- Tabs para diferentes modos de busca
- Loading spinner durante processamento
- Resultados organizados em cards
- Seções expansíveis para sócios
- Botões de exportação destacados
- Integração visual com HubSpot

## 🔒 Segurança

- Upload de arquivos validado (apenas .xlsx, .xls)
- Limpeza automática de arquivos temporários
- Validação de CNPJs
- Tratamento de erros robusto
- API Key do HubSpot em variável de ambiente

## 🐛 Tratamento de Erros

O sistema trata:
- CNPJs inválidos
- Falhas de API
- Uploads corrompidos
- Erros de conexão
- Timeouts
- Erros do HubSpot

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique se as APIs públicas estão funcionando
2. Confirme a API Key do HubSpot
3. Verifique os logs do servidor
4. Consulte a documentação das APIs

## 🚀 Melhorias Futuras

- [ ] Cache de resultados para evitar consultas duplicadas
- [ ] Integração com outras APIs de enriquecimento de dados
- [ ] Histórico de consultas
- [ ] Relatórios e analytics
- [ ] Busca automática real de LinkedIn
- [ ] Validação de e-mails
- [ ] Score de qualidade dos leads
- [ ] Webhooks para notificações

## 📝 Licença

Este projeto faz parte do sistema de cadastro de empresas.
