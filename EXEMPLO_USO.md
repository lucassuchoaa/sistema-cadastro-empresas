# Exemplo de Uso do Sistema

## Passo a Passo para Começar

### 1. Criar sua primeira empresa

1. Acesse: http://localhost:3000/admin/criar-empresa
2. Preencha os dados:
   - **Nome**: "Minha Empresa Ltda"
   - **Slug**: "minha-empresa" (será gerado automaticamente)
   - **Senha**: "123456" (use uma senha segura)
   - **Cor**: Escolha uma cor (ex: #007bff)
   - **Logo**: (opcional) Cole a URL de um logo

### 2. Acessar a landing page

Após criar, sua landing page estará em:
```
http://localhost:3000/empresa/minha-empresa
```

### 3. Testar o cadastro

1. Acesse a landing page
2. Preencha o formulário com dados de teste:
   - **Nome**: "João Silva"
   - **E-mail**: "joao@exemplo.com"
   - **Telefone**: "(11) 99999-9999"
   - **Cargo**: "Desenvolvedor"
   - **Departamento**: "Tecnologia da Informação"
3. Clique em "Cadastrar"

### 4. Acessar o dashboard administrativo

1. Acesse: http://localhost:3000/admin/login
2. Digite:
   - **Empresa**: "minha-empresa"
   - **Senha**: "123456"
3. Clique em "Entrar"

### 5. Gerenciar colaboradores

No dashboard você pode:
- Ver o colaborador cadastrado
- Baixar a planilha Excel
- Copiar o link do formulário
- Ver estatísticas em tempo real

## URLs Importantes

- **Página inicial**: http://localhost:3000
- **Criar empresa**: http://localhost:3000/admin/criar-empresa
- **Login admin**: http://localhost:3000/admin/login
- **Landing page**: http://localhost:3000/empresa/[slug]
- **Dashboard**: http://localhost:3000/admin/dashboard (após login)

## Compartilhando o Formulário

Para que colaboradores se cadastrem:
1. Copie o link da landing page
2. Compartilhe via WhatsApp, email, etc.
3. Os cadastros aparecerão automaticamente no dashboard
4. A planilha será atualizada em tempo real

## Baixando a Planilha

1. Faça login no dashboard
2. Clique em "Baixar Planilha"
3. O arquivo Excel será baixado com todos os dados

## Dicas

- Use slugs simples e descritivos (ex: "empresa-abc", "consultoria-xyz")
- Escolha cores que combinem com a identidade da empresa
- Teste sempre o formulário antes de compartilhar
- O dashboard atualiza automaticamente a cada 30 segundos
- Mantenha a senha segura - ela dá acesso a todos os dados