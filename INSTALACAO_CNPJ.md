# 🚀 Guia de Instalação - Sistema de Consulta CNPJ

## ✅ Checklist de Instalação

### 1. ✅ Dependências já instaladas

As seguintes dependências foram instaladas automaticamente:

```bash
npm install axios multer @hubspot/api-client
```

**Pacotes instalados:**
- `axios` - Para fazer requisições HTTP às APIs de CNPJ
- `multer` - Para upload de arquivos Excel
- `@hubspot/api-client` - Cliente oficial do HubSpot

### 2. ✅ Estrutura de pastas criada

Os seguintes diretórios foram criados:

```
/workspace/
├── services/              ✅ Criado
│   ├── cnpjService.js    ✅ Criado
│   ├── excelService.js   ✅ Criado
│   └── hubspotService.js ✅ Criado
├── views/
│   └── cnpj-lookup.ejs   ✅ Criado
├── uploads/               ✅ Criado (para uploads temporários)
└── planilhas/
    └── exports/           ✅ Criado (para exportações)
```

### 3. ✅ Código implementado

Todas as funcionalidades foram implementadas:

- ✅ Serviço de busca CNPJ (BrasilAPI + ReceitaWS)
- ✅ Serviço de manipulação Excel
- ✅ Serviço de integração HubSpot
- ✅ Landing Page completa e responsiva
- ✅ Rotas da API no servidor
- ✅ Upload de arquivos
- ✅ Exportação para Excel
- ✅ Exportação para HubSpot

## 🔧 Configuração Necessária

### Configurar HubSpot (Opcional)

Para usar a integração com HubSpot, você precisa:

1. **Obter API Key do HubSpot:**
   - Acesse: https://app.hubspot.com/
   - Vá em: Settings → Integrations → API Key
   - Clique em "Create API Key" ou copie a existente

2. **Adicionar ao arquivo .env:**
   
   Crie ou edite o arquivo `.env` na raiz do projeto:
   
   ```env
   # ... outras variáveis ...
   
   # Integração HubSpot
   HUBSPOT_API_KEY=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

   **⚠️ Importante:** 
   - Substitua `pat-na1-xxxxxxxx...` pela sua API Key real
   - Nunca compartilhe ou commite este arquivo

3. **Reiniciar o servidor:**
   
   ```bash
   npm run dev
   # ou
   npm start
   ```

## 🎯 Como Usar

### 1. Iniciar o servidor

```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

### 2. Acessar a Landing Page

Abra o navegador e acesse:

```
http://localhost:3000/cnpj
```

### 3. Testar as funcionalidades

#### Teste 1: CNPJ Individual
1. Acesse a aba "CNPJ Individual"
2. Digite um CNPJ de teste: `00000000000191`
3. Clique em "Buscar Dados"
4. Verifique os resultados

#### Teste 2: Múltiplos CNPJs
1. Acesse a aba "Múltiplos CNPJs"
2. Digite vários CNPJs (um por linha):
   ```
   00000000000191
   27865757000102
   ```
3. Clique em "Buscar Dados"

#### Teste 3: Upload de Planilha
1. Acesse a aba "Upload Planilha"
2. Baixe o modelo de planilha
3. Preencha com CNPJs válidos
4. Faça upload do arquivo
5. Clique em "Processar Planilha"

#### Teste 4: Exportar para Excel
1. Após qualquer busca bem-sucedida
2. Clique em "📥 Baixar Excel"
3. Verifique o arquivo baixado

#### Teste 5: Exportar para HubSpot (se configurado)
1. Configure a API Key do HubSpot no .env
2. Reinicie o servidor
3. Faça uma busca de CNPJ
4. Clique em "🚀 Exportar para HubSpot"
5. Configure as opções desejadas
6. Clique em "Enviar para HubSpot"

## 📊 Endpoints da API

Todos os endpoints estão funcionais:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/cnpj` | Landing Page |
| POST | `/api/cnpj/buscar` | Buscar CNPJs |
| POST | `/api/cnpj/upload` | Upload de planilha |
| GET | `/cnpj/download-modelo` | Download modelo |
| POST | `/api/cnpj/exportar-excel` | Exportar Excel |
| GET | `/api/hubspot/pipelines` | Listar pipelines |
| POST | `/api/hubspot/exportar` | Exportar HubSpot |

## 🔍 Testar APIs diretamente

### Usando cURL:

```bash
# Buscar um CNPJ
curl -X POST http://localhost:3000/api/cnpj/buscar \
  -H "Content-Type: application/json" \
  -d '{"cnpjs":["00000000000191"]}'

# Baixar modelo de planilha
curl -O http://localhost:3000/cnpj/download-modelo

# Listar pipelines do HubSpot
curl http://localhost:3000/api/hubspot/pipelines
```

### Usando Postman/Insomnia:

1. **Buscar CNPJ:**
   - Método: POST
   - URL: `http://localhost:3000/api/cnpj/buscar`
   - Body (JSON):
     ```json
     {
       "cnpjs": ["00000000000191", "27865757000102"]
     }
     ```

2. **Upload de Planilha:**
   - Método: POST
   - URL: `http://localhost:3000/api/cnpj/upload`
   - Body: form-data
   - Key: `planilha`
   - Type: File
   - Value: [selecione arquivo .xlsx]

## ⚠️ Solução de Problemas

### Erro: "Cannot find module 'axios'"

```bash
npm install axios multer @hubspot/api-client
```

### Erro: "ENOENT: no such file or directory, scandir 'uploads'"

```bash
mkdir -p uploads planilhas/exports
```

### Erro: "HubSpot não configurado"

- Verifique se adicionou `HUBSPOT_API_KEY` no arquivo `.env`
- Reinicie o servidor após adicionar a variável

### API BrasilAPI/ReceitaWS não responde

- As APIs públicas podem ter rate limiting
- Aguarde alguns minutos e tente novamente
- O sistema tenta BrasilAPI primeiro, depois ReceitaWS automaticamente

### Upload de planilha não funciona

- Verifique se o arquivo é .xlsx ou .xls
- Confirme que a coluna se chama "CNPJ"
- Use o modelo de planilha fornecido

## 📝 Notas Importantes

### Limitações das APIs Públicas

- **BrasilAPI**: Pode ter instabilidade em horários de pico
- **ReceitaWS**: Limite de 3 requisições por minuto
- Use com moderação para evitar bloqueios

### LinkedIn

- O sistema retorna URLs de busca do LinkedIn
- Para integração real, seria necessário:
  - APIs pagas (Proxycurl, RocketReach)
  - Web scraping (pode violar termos de uso)

### Dados Estimados

- Quantidade de funcionários e faturamento são estimativas
- Baseados no porte e capital social da empresa
- Para dados precisos, use APIs especializadas

## 🎨 Customização

### Cores e Tema

Edite o arquivo `/workspace/views/cnpj-lookup.ejs`:

```css
/* Alterar gradiente do background */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Alterar cor primária */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adicionar Campos Customizados no HubSpot

Edite `/workspace/services/hubspotService.js` na função `criarEmpresa`:

```javascript
properties: {
  // ... campos existentes ...
  seu_campo_customizado: dados.algumValor
}
```

## 📚 Documentação Adicional

- [README_CNPJ_LOOKUP.md](./README_CNPJ_LOOKUP.md) - Documentação completa
- [BrasilAPI Docs](https://brasilapi.com.br/docs)
- [ReceitaWS Docs](https://www.receitaws.com.br/api)
- [HubSpot API Docs](https://developers.hubspot.com/docs/api/overview)

## ✅ Checklist Final

Antes de considerar a instalação completa, verifique:

- [ ] Servidor inicia sem erros
- [ ] Página `/cnpj` carrega corretamente
- [ ] Busca de CNPJ individual funciona
- [ ] Busca de múltiplos CNPJs funciona
- [ ] Upload de planilha funciona
- [ ] Download do modelo funciona
- [ ] Exportação para Excel funciona
- [ ] HubSpot configurado (se necessário)
- [ ] Exportação para HubSpot funciona (se configurado)

## 🎉 Pronto!

O sistema está completamente funcional e pronto para uso!

Para questões ou melhorias, consulte o arquivo README_CNPJ_LOOKUP.md ou os comentários no código.
