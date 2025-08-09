# 🤝 Guia de Contribuição

Obrigado por considerar contribuir para o Sistema de Cadastro de Empresas! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Padrões de Commit](#padrões-de-commit)
- [Pull Requests](#pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Features](#sugerir-features)

## 📜 Código de Conduta

Este projeto adere ao [Código de Conduta do Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, você deve seguir este código.

## 🚀 Como Contribuir

Existem várias maneiras de contribuir:

- 🐛 Reportar bugs
- 💡 Sugerir novas features
- 📝 Melhorar documentação
- 🔧 Corrigir bugs
- ✨ Implementar novas features
- 🧪 Escrever testes
- 📖 Traduzir conteúdo

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- Node.js 18.x ou superior
- npm 9.x ou superior
- Git

### Instalação

1. **Fork o repositório**
   ```bash
   # Clique no botão "Fork" no GitHub
   ```

2. **Clone seu fork**
   ```bash
   git clone https://github.com/SEU_USERNAME/sistema-cadastro-empresas.git
   cd sistema-cadastro-empresas
   ```

3. **Adicione o repositório original como upstream**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_USERNAME/sistema-cadastro-empresas.git
   ```

4. **Instale as dependências**
   ```bash
   npm install
   ```

5. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

6. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

## 🔄 Processo de Desenvolvimento

### Workflow Git

1. **Mantenha seu fork atualizado**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Crie uma branch para sua feature/fix**
   ```bash
   git checkout -b feature/nome-da-feature
   # ou
   git checkout -b fix/nome-do-bug
   ```

3. **Faça suas alterações**
   - Escreva código limpo e bem documentado
   - Siga os padrões de código existentes
   - Adicione testes quando necessário

4. **Teste suas alterações**
   ```bash
   npm test
   npm run lint
   ```

5. **Commit suas alterações**
   ```bash
   npm run commit
   # Use o commitizen para commits padronizados
   ```

6. **Push para seu fork**
   ```bash
   git push origin feature/nome-da-feature
   ```

7. **Abra um Pull Request**

### Estrutura de Branches

- `main`: Branch principal (produção)
- `develop`: Branch de desenvolvimento
- `feature/*`: Novas features
- `fix/*`: Correções de bugs
- `hotfix/*`: Correções urgentes
- `release/*`: Preparação de releases

## 📝 Padrões de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para padronizar mensagens de commit:

```
type(scope): description

[optional body]

[optional footer]
```

### Tipos de Commit

- `feat`: Nova feature
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (sem mudança de código)
- `refactor`: Refatoração
- `perf`: Melhoria de performance
- `test`: Testes
- `chore`: Tarefas de manutenção
- `ci`: Configuração de CI/CD

### Exemplos

```bash
feat(auth): add login functionality
fix(dashboard): resolve data loading issue
docs(readme): update installation instructions
style(components): format code with prettier
```

## 🔍 Pull Requests

### Antes de Abrir um PR

- [ ] Código testado localmente
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Commits seguem padrão conventional
- [ ] Branch atualizada com main

### Template de PR

Use o template fornecido ao abrir um PR. Inclua:

- Descrição clara das mudanças
- Issue relacionada (se houver)
- Tipo de mudança
- Como foi testado
- Screenshots (se aplicável)
- Checklist completo

### Processo de Review

1. **Automated Checks**: CI/CD deve passar
2. **Code Review**: Pelo menos 1 aprovação
3. **Testing**: Testes manuais se necessário
4. **Merge**: Squash and merge preferido

## 🐛 Reportar Bugs

Use o [template de bug report](.github/ISSUE_TEMPLATE/bug_report.md) e inclua:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots/logs
- Informações do ambiente

## 💡 Sugerir Features

Use o [template de feature request](.github/ISSUE_TEMPLATE/feature_request.md) e inclua:

- Descrição da feature
- Motivação/problema que resolve
- Solução proposta
- Alternativas consideradas
- Mockups/wireframes (se aplicável)

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

### Escrever Testes

- Teste unitário para funções/componentes
- Teste de integração para fluxos
- Teste E2E para funcionalidades críticas

## 📚 Documentação

### Atualizando Docs

- README.md para informações gerais
- CONTRIBUTING.md para guias de contribuição
- Comentários no código para lógica complexa
- JSDoc para funções/classes

## 🏷️ Versionamento

Usamos [Semantic Versioning](https://semver.org/):

- `MAJOR`: Mudanças incompatíveis
- `MINOR`: Novas features compatíveis
- `PATCH`: Correções compatíveis

## 🎯 Boas Práticas

### Código

- Mantenha funções pequenas e focadas
- Use nomes descritivos para variáveis/funções
- Comente código complexo
- Evite duplicação de código
- Siga princípios SOLID

### Git

- Commits pequenos e focados
- Mensagens de commit descritivas
- Rebase antes de merge
- Mantenha histórico limpo

### Performance

- Otimize queries de banco
- Use cache quando apropriado
- Minimize dependências
- Monitore performance

## 🆘 Precisa de Ajuda?

- 📧 Email: [email@exemplo.com]
- 💬 Discord: [link do servidor]
- 📱 Telegram: [link do grupo]
- 🐛 Issues: [GitHub Issues](https://github.com/username/sistema-cadastro-empresas/issues)

## 🙏 Reconhecimento

Todos os contribuidores são reconhecidos no README.md. Obrigado por tornar este projeto melhor!

---

**Lembre-se**: Contribuições de qualquer tamanho são valiosas. Desde correções de typos até novas features, toda ajuda é bem-vinda! 🎉