# 📑 Índice - Sistema de Consulta CNPJ

## 🎯 Início Rápido

**Para começar a usar o sistema:**
1. Leia: [INSTALACAO_CNPJ.md](./INSTALACAO_CNPJ.md)
2. Acesse: `http://localhost:3000/cnpj`
3. Consulte: [EXEMPLOS_USO_CNPJ.md](./EXEMPLOS_USO_CNPJ.md)

---

## 📚 Documentação Completa

### 1. [RESUMO_IMPLEMENTACAO.md](./RESUMO_IMPLEMENTACAO.md)
**O que é:** Visão geral do projeto

**Quando usar:** 
- Entender o que foi implementado
- Ver checklist de funcionalidades
- Conferir arquivos criados
- Obter visão geral técnica

**Conteúdo:**
- ✅ Lista completa de funcionalidades
- 📁 Estrutura de arquivos
- 🔌 APIs implementadas
- 🎨 Detalhes da interface
- 📊 Tecnologias utilizadas

---

### 2. [INSTALACAO_CNPJ.md](./INSTALACAO_CNPJ.md)
**O que é:** Guia de instalação e configuração

**Quando usar:**
- Primeira vez usando o sistema
- Configurar HubSpot
- Resolver problemas técnicos
- Fazer deploy

**Conteúdo:**
- ✅ Checklist de instalação
- 🔧 Configuração do HubSpot
- 🎯 Como usar cada funcionalidade
- 📊 Endpoints disponíveis
- ⚠️ Solução de problemas

---

### 3. [README_CNPJ_LOOKUP.md](./README_CNPJ_LOOKUP.md)
**O que é:** Documentação técnica completa

**Quando usar:**
- Entender como o sistema funciona
- Consultar APIs
- Ver limitações
- Planejar melhorias

**Conteúdo:**
- 📋 Descrição detalhada
- ✨ Funcionalidades completas
- 🚀 Instalação técnica
- 📖 Uso avançado
- 🔧 APIs disponíveis
- 🔑 Configuração HubSpot
- ⚠️ Limitações conhecidas
- 🚀 Melhorias futuras

---

### 4. [EXEMPLOS_USO_CNPJ.md](./EXEMPLOS_USO_CNPJ.md)
**O que é:** Exemplos práticos passo a passo

**Quando usar:**
- Aprender a usar o sistema
- Ver casos de uso reais
- Consultar exemplos de API
- Entender fluxos de trabalho

**Conteúdo:**
- 🎯 15 exemplos práticos
- 📝 Código de exemplo
- 🔄 Fluxos completos
- 💡 Dicas avançadas
- 📞 Casos de uso reais
- ✅ Boas práticas

---

## 🗂️ Arquivos do Projeto

### Backend (Serviços)
```
services/
├── cnpjService.js       - Busca dados de CNPJ (BrasilAPI + ReceitaWS)
├── excelService.js      - Manipulação de arquivos Excel
└── hubspotService.js    - Integração com HubSpot CRM
```

### Frontend (Views)
```
views/
└── cnpj-lookup.ejs      - Landing Page completa
```

### Servidor
```
server.js                - Rotas da API adicionadas
```

### Configuração
```
config/
└── env.example          - Variáveis de ambiente (incluindo HUBSPOT_API_KEY)
```

---

## 🚀 Quick Start

### Para Usuários

```bash
# 1. Iniciar servidor
npm run dev

# 2. Acessar
http://localhost:3000/cnpj

# 3. Buscar CNPJ
- Digite CNPJ na interface
- Ou faça upload de planilha
- Exporte resultados
```

### Para Desenvolvedores

```bash
# 1. Ver estrutura
ls services/        # Serviços backend
ls views/          # Landing Page

# 2. Testar API
curl -X POST http://localhost:3000/api/cnpj/buscar \
  -H "Content-Type: application/json" \
  -d '{"cnpjs":["00000000000191"]}'

# 3. Ver logs
tail -f logs/app.log
```

---

## 🎯 Casos de Uso Principais

### 1. Prospecção Individual
→ [Exemplo 1](./EXEMPLOS_USO_CNPJ.md#exemplo-1-consultar-cnpj-individual)

### 2. Prospecção em Massa
→ [Exemplo 3](./EXEMPLOS_USO_CNPJ.md#exemplo-3-upload-de-planilha)

### 3. Exportar para Excel
→ [Exemplo 4](./EXEMPLOS_USO_CNPJ.md#exemplo-4-exportar-para-excel)

### 4. Integração HubSpot
→ [Exemplo 6](./EXEMPLOS_USO_CNPJ.md#exemplo-6-exportar-para-hubspot---completo)

### 5. Uso via API
→ [Exemplo 7](./EXEMPLOS_USO_CNPJ.md#exemplo-7-busca-via-api-curl)

---

## 🔧 Configuração

### Obrigatório
- ✅ Node.js instalado
- ✅ Dependências instaladas (`npm install`)
- ✅ MongoDB rodando

### Opcional (para HubSpot)
- 🔧 API Key do HubSpot
- 🔧 Variável `HUBSPOT_API_KEY` no `.env`

Ver: [INSTALACAO_CNPJ.md - Seção Configuração](./INSTALACAO_CNPJ.md#🔧-configuração-necessária)

---

## 📊 Dados Coletados

Para cada CNPJ consultado:

✅ **Cadastrais**
- Razão Social
- Nome Fantasia
- CNPJ
- Data Abertura
- Situação
- Natureza Jurídica
- Capital Social
- Porte

✅ **Econômicos**
- CNAE
- Atividade Principal
- Quantidade Funcionários (estimado)
- Faturamento (estimado)

✅ **Contato**
- E-mail
- Telefones
- Endereço completo

✅ **Quadro Societário**
- Nome dos sócios
- Qualificação
- CPF/CNPJ
- Data entrada
- LinkedIn (URL de busca)

---

## 🔌 APIs Principais

| Endpoint | Descrição | Documentação |
|----------|-----------|--------------|
| `GET /cnpj` | Landing Page | [Exemplo 1](./EXEMPLOS_USO_CNPJ.md#exemplo-1-consultar-cnpj-individual) |
| `POST /api/cnpj/buscar` | Buscar CNPJs | [Exemplo 7](./EXEMPLOS_USO_CNPJ.md#exemplo-7-busca-via-api-curl) |
| `POST /api/cnpj/upload` | Upload planilha | [Exemplo 9](./EXEMPLOS_USO_CNPJ.md#exemplo-9-upload-via-api-curl) |
| `POST /api/cnpj/exportar-excel` | Exportar Excel | [README](./README_CNPJ_LOOKUP.md#post-apicnpjexportar-excel) |
| `POST /api/hubspot/exportar` | Exportar HubSpot | [Exemplo 6](./EXEMPLOS_USO_CNPJ.md#exemplo-6-exportar-para-hubspot---completo) |
| `GET /api/hubspot/pipelines` | Listar pipelines | [Exemplo 10](./EXEMPLOS_USO_CNPJ.md#exemplo-10-listar-pipelines-do-hubspot) |

Ver todas: [README_CNPJ_LOOKUP.md - APIs](./README_CNPJ_LOOKUP.md#🔧-apis-disponíveis)

---

## ⚠️ Limitações Importantes

### APIs Públicas
- BrasilAPI: Instabilidade ocasional
- ReceitaWS: 3 requisições/minuto
- Sistema usa fallback automático

### LinkedIn
- Retorna URL de busca (não scraping)
- Para integração real, necessário API paga

### Dados Estimados
- Funcionários: baseado em porte
- Faturamento: estimativa
- Use como referência, não como verdade absoluta

Ver mais: [README_CNPJ_LOOKUP.md - Limitações](./README_CNPJ_LOOKUP.md#⚠️-limitações)

---

## 🆘 Precisa de Ajuda?

### Problema Técnico
→ [INSTALACAO_CNPJ.md - Solução de Problemas](./INSTALACAO_CNPJ.md#⚠️-solução-de-problemas)

### Como Usar
→ [EXEMPLOS_USO_CNPJ.md](./EXEMPLOS_USO_CNPJ.md)

### Entender Código
→ [README_CNPJ_LOOKUP.md](./README_CNPJ_LOOKUP.md)

### Visão Geral
→ [RESUMO_IMPLEMENTACAO.md](./RESUMO_IMPLEMENTACAO.md)

---

## 📝 Checklist de Uso

### Primeira Vez
- [ ] Ler [INSTALACAO_CNPJ.md](./INSTALACAO_CNPJ.md)
- [ ] Configurar HubSpot (se necessário)
- [ ] Testar com 1 CNPJ
- [ ] Testar exportação Excel
- [ ] Testar exportação HubSpot

### Uso Diário
- [ ] Acessar `/cnpj`
- [ ] Buscar CNPJs
- [ ] Revisar dados
- [ ] Exportar resultados
- [ ] Acompanhar no CRM

### Manutenção
- [ ] Monitorar logs
- [ ] Verificar rate limits
- [ ] Atualizar HubSpot API Key
- [ ] Backup de dados exportados

---

## 🎓 Recursos Externos

### APIs Usadas
- [BrasilAPI](https://brasilapi.com.br/docs) - Dados de CNPJ
- [ReceitaWS](https://www.receitaws.com.br/api) - Backup de dados
- [HubSpot](https://developers.hubspot.com/docs/api/overview) - CRM

### LinkedIn
- [LinkedIn Sales Navigator](https://business.linkedin.com/sales-solutions/sales-navigator) - Para prospecção
- [Proxycurl](https://nubela.co/proxycurl/) - API de LinkedIn
- [RocketReach](https://rocketreach.co/) - Busca de contatos

---

## 🚀 Próximos Passos

1. **Começar a usar**
   - Leia: [INSTALACAO_CNPJ.md](./INSTALACAO_CNPJ.md)
   - Pratique: [EXEMPLOS_USO_CNPJ.md](./EXEMPLOS_USO_CNPJ.md)

2. **Configurar produção**
   - Deploy na Vercel
   - Configurar variáveis de ambiente
   - Testar integrações

3. **Otimizar uso**
   - Criar templates de pipeline
   - Automatizar workflows
   - Treinar equipe

---

## 📞 Contato e Suporte

Para dúvidas técnicas, consulte:
1. Este índice
2. Documentação específica
3. Comentários no código
4. Issues no repositório

---

## ✅ Status do Projeto

🟢 **COMPLETO E FUNCIONAL**

Todas as funcionalidades implementadas:
- ✅ Busca de CNPJ
- ✅ Upload de planilha
- ✅ Exportação Excel
- ✅ Integração HubSpot
- ✅ LinkedIn dos sócios
- ✅ Seleção de pipeline
- ✅ Interface completa
- ✅ Documentação completa

---

**Acesse: `http://localhost:3000/cnpj`**

**Boa prospecção! 🎯**
