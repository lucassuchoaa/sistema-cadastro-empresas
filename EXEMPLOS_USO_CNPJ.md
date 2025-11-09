# 📚 Exemplos de Uso - Sistema de Consulta CNPJ

## 🎯 Exemplos Práticos

### Exemplo 1: Consultar CNPJ Individual

#### Passo a passo:
1. Acesse: `http://localhost:3000/cnpj`
2. Clique na aba "CNPJ Individual"
3. Digite: `00.000.000/0001-91` (ou apenas `00000000000191`)
4. Clique em "Buscar Dados"

#### Resultado esperado:
```
✅ Razão Social: Empresa Exemplo LTDA
✅ Nome Fantasia: Exemplo
✅ Situação: Ativa
✅ Porte: Microempresa
✅ Funcionários: 1-19 funcionários
✅ Faturamento: Até R$ 360 mil/ano
✅ Sócios: João Silva, Maria Santos
✅ LinkedIn: Links de busca disponíveis
```

---

### Exemplo 2: Consultar Múltiplos CNPJs

#### Passo a passo:
1. Clique na aba "Múltiplos CNPJs"
2. Digite (um por linha):
```
00.000.000/0001-91
27.865.757/0001-02
11.222.333/0001-81
```
3. Clique em "Buscar Dados"

#### Resultado:
- Sistema busca todos os CNPJs
- Exibe card individual para cada empresa
- Mostra erros para CNPJs inválidos
- Delay de 1s entre cada busca (evita rate limit)

---

### Exemplo 3: Upload de Planilha

#### Criar planilha:

**modelo.xlsx:**
| CNPJ |
|------|
| 00000000000191 |
| 27865757000102 |
| 11222333000181 |

#### Passo a passo:
1. Clique na aba "Upload Planilha"
2. Clique em "⬇️ Baixar modelo de planilha"
3. Preencha o modelo baixado
4. Clique em "📁 Clique para selecionar..."
5. Selecione seu arquivo
6. Clique em "Processar Planilha"

#### Notas:
- Coluna pode se chamar: CNPJ, cnpj, Cnpj, Documento
- CNPJs podem ter ou não formatação
- Sistema valida automaticamente

---

### Exemplo 4: Exportar para Excel

#### Cenário: Você fez uma busca e quer salvar os dados

1. Após qualquer busca bem-sucedida
2. Role até o final da página
3. Clique em "📥 Baixar Excel"
4. Arquivo será baixado: `consulta_cnpj_[timestamp].xlsx`

#### Estrutura do Excel:
```
| CNPJ | Razão Social | Nome Fantasia | ... | Sócio | Qualificação | LinkedIn |
|------|--------------|---------------|-----|-------|--------------|----------|
| xxx  | Empresa A    | Fantasia A    | ... | -     | -            | -        |
| xxx  | Empresa A    | -             | ... | João  | Sócio Admin  | link     |
| xxx  | Empresa A    | -             | ... | Maria | Sócio Admin  | link     |
| yyy  | Empresa B    | Fantasia B    | ... | -     | -            | -        |
```

---

### Exemplo 5: Exportar para HubSpot - Básico

#### Cenário: Criar apenas empresas no HubSpot

#### Configuração prévia:
```env
# .env
HUBSPOT_API_KEY=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

#### Passo a passo:
1. Faça uma busca de CNPJ
2. Clique em "🚀 Exportar para HubSpot"
3. Marque apenas:
   - ✅ Criar empresa no HubSpot
4. Clique em "Enviar para HubSpot"

#### Resultado no HubSpot:
```
Empresa criada com:
- Nome: Razão Social
- Domain: extraído do e-mail
- Telefone: telefone principal
- Endereço completo
- CNPJ (campo customizado)
- Porte, Capital Social, etc.
```

---

### Exemplo 6: Exportar para HubSpot - Completo

#### Cenário: Criar empresa + contatos + negócio

#### Passo a passo:
1. Faça busca de CNPJs
2. Clique em "🚀 Exportar para HubSpot"
3. Marque:
   - ✅ Criar empresa no HubSpot
   - ✅ Criar contatos (sócios)
   - ✅ Criar negócio
4. Selecione:
   - Pipeline: "Vendas - Consultoria"
   - Estágio: "Prospecção"
5. Clique em "Enviar para HubSpot"

#### Resultado no HubSpot:
```
✅ Empresa: Empresa XYZ LTDA
   └── Contatos:
       ├── João Silva (Sócio Administrador)
       └── Maria Santos (Sócio)
   └── Negócio:
       ├── Nome: Oportunidade - Empresa XYZ LTDA
       ├── Pipeline: Vendas - Consultoria
       ├── Estágio: Prospecção
       └── Valor: R$ 360.000 (baseado em faturamento)
```

---

### Exemplo 7: Busca via API (cURL)

#### Buscar um CNPJ:
```bash
curl -X POST http://localhost:3000/api/cnpj/buscar \
  -H "Content-Type: application/json" \
  -d '{
    "cnpjs": ["00000000000191"]
  }'
```

#### Resposta:
```json
{
  "success": true,
  "resultados": [
    {
      "sucesso": true,
      "cnpj": "00000000000191",
      "dados": {
        "cnpj": "00.000.000/0001-91",
        "razaoSocial": "EMPRESA EXEMPLO LTDA",
        "nomeFantasia": "EXEMPLO",
        "socios": [
          {
            "nome": "JOAO SILVA",
            "qualificacao": "Sócio-Administrador",
            "linkedin": "https://www.linkedin.com/search/results/people/?keywords=JOAO+SILVA"
          }
        ],
        "quantidadeFuncionarios": "1-19 funcionários",
        "faturamentoEstimado": "Até R$ 360 mil/ano"
      }
    }
  ],
  "total": 1,
  "sucesso": 1,
  "erros": 0
}
```

---

### Exemplo 8: Busca Múltipla via API

```bash
curl -X POST http://localhost:3000/api/cnpj/buscar \
  -H "Content-Type: application/json" \
  -d '{
    "cnpjs": [
      "00000000000191",
      "27865757000102",
      "11222333000181"
    ]
  }'
```

---

### Exemplo 9: Upload via API (cURL)

```bash
curl -X POST http://localhost:3000/api/cnpj/upload \
  -F "planilha=@/caminho/para/arquivo.xlsx"
```

---

### Exemplo 10: Listar Pipelines do HubSpot

#### Via navegador:
```
http://localhost:3000/api/hubspot/pipelines
```

#### Via cURL:
```bash
curl http://localhost:3000/api/hubspot/pipelines
```

#### Resposta:
```json
{
  "success": true,
  "pipelines": [
    {
      "id": "default",
      "label": "Pipeline de Vendas",
      "stages": [
        { "id": "appointmentscheduled", "label": "Reunião Agendada" },
        { "id": "qualifiedtobuy", "label": "Qualificado" },
        { "id": "presentationscheduled", "label": "Apresentação" },
        { "id": "decisionmakerboughtin", "label": "Negociação" },
        { "id": "closedwon", "label": "Ganho" }
      ]
    }
  ]
}
```

---

### Exemplo 11: Fluxo Completo de Prospecção

#### Cenário real: Empresa de consultoria quer prospectar 50 empresas

#### Passo 1: Preparar lista
```
Equipe comercial identifica 50 CNPJs de prospects
Salva em planilha Excel usando modelo fornecido
```

#### Passo 2: Processar
```
1. Acessa /cnpj
2. Upload da planilha
3. Sistema busca todos (leva ~1 min para 50 CNPJs)
4. Resultados aparecem na tela
```

#### Passo 3: Analisar
```
1. Revisa dados de cada empresa
2. Verifica sócios e representantes
3. Acessa LinkedIn dos decisores
4. Filtra empresas qualificadas
```

#### Passo 4: Exportar
```
Opção A - Análise interna:
  → Baixa Excel
  → Compartilha com equipe
  → Planeja abordagem

Opção B - Direto no CRM:
  → Seleciona pipeline "Prospecção Ativa"
  → Seleciona estágio "Qualificação"
  → Exporta tudo para HubSpot
  → Equipe começa follow-up
```

---

### Exemplo 12: Integração com Workflow

#### Cenário: Automatizar enriquecimento de leads

```javascript
// Script Node.js para automatizar

const axios = require('axios');
const fs = require('fs');

async function enriquecerLeads() {
  // 1. Ler lista de CNPJs
  const cnpjs = fs.readFileSync('leads.txt', 'utf-8')
    .split('\n')
    .filter(c => c.trim());

  // 2. Buscar dados
  const response = await axios.post('http://localhost:3000/api/cnpj/buscar', {
    cnpjs
  });

  // 3. Exportar para HubSpot automaticamente
  await axios.post('http://localhost:3000/api/hubspot/exportar', {
    resultados: response.data.resultados,
    opcoes: {
      criarEmpresa: true,
      criarContatos: true,
      criarNegocio: true,
      pipelineId: 'default',
      stageId: 'appointmentscheduled'
    }
  });

  console.log('✅ Leads enriquecidos e exportados!');
}

enriquecerLeads();
```

---

### Exemplo 13: Tratamento de Erros

#### CNPJs inválidos ou não encontrados:

```
Entrada:
- 00000000000191 ✅ Encontrado
- 99999999999999 ❌ Não encontrado
- 11111111111111 ❌ Inválido

Resultado:
- Card verde para sucesso
- Card vermelho para erro
- Mensagem clara do problema
- Download Excel inclui linha com "ERRO"
- HubSpot: só exporta os válidos
```

---

### Exemplo 14: CNPJs de Teste

#### Para testar o sistema, use:

```
✅ CNPJs válidos (exemplos):
- 00.000.000/0001-91
- 27.865.757/0001-02
- 07.526.557/0001-00 (Correios)
- 33.000.167/0001-01 (Petrobrás)

❌ CNPJs inválidos (para testar erro):
- 00.000.000/0000-00
- 99.999.999/9999-99
- 12345678901234
```

---

### Exemplo 15: Performance em Massa

#### Consultar 100 CNPJs:

```
Tempo estimado: ~2 minutos
- 1 segundo de delay entre cada
- Mais tempo de processamento de API

Recomendações:
- Processe em lotes de 50
- Monitore rate limits das APIs
- Use em horários de menos tráfego
```

---

## 🎓 Dicas Avançadas

### 1. Melhor Horário
- APIs públicas são mais estáveis de manhã
- Evite horários de pico (12h-14h)

### 2. Rate Limits
- BrasilAPI: Sem limite documentado
- ReceitaWS: 3 req/min
- Sistema já implementa delay

### 3. HubSpot
- Use campos customizados para CNPJ
- Configure pipelines antes
- Monitore duplicatas

### 4. LinkedIn
- URLs são de busca pública
- Para automação real, use APIs pagas
- Respeite termos de uso

### 5. Dados Estimados
- Use com cautela para decisões
- Complemente com outras fontes
- Faturamento é apenas estimativa

---

## 📞 Casos de Uso Reais

### 1. Vendas B2B
- Enriquecer lista de prospects
- Identificar decisores
- Criar pipeline de vendas

### 2. Marketing
- Segmentação por porte
- Personalização de campanhas
- Score de leads

### 3. Compliance
- Validação de fornecedores
- Due diligence
- Auditoria de cadastros

### 4. Análise de Mercado
- Mapeamento de concorrentes
- Pesquisa de setor
- Inteligência competitiva

---

## ✅ Checklist de Boas Práticas

- [ ] Sempre teste com poucos CNPJs primeiro
- [ ] Valide qualidade dos dados obtidos
- [ ] Configure HubSpot antes de exportar em massa
- [ ] Mantenha backup dos dados exportados
- [ ] Respeite limites das APIs públicas
- [ ] Use LinkedIn apenas para busca manual
- [ ] Documente seu processo
- [ ] Treine equipe no uso do sistema

---

## 🚀 Pronto para Começar!

Acesse: `http://localhost:3000/cnpj`

Ou consulte:
- **README_CNPJ_LOOKUP.md** - Documentação técnica
- **INSTALACAO_CNPJ.md** - Guia de instalação
- **RESUMO_IMPLEMENTACAO.md** - Visão geral

**Boa prospecção! 🎯**
