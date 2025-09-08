# 📋 Painel de Administração de Usuários - DayTrack

## 🚀 Como acessar o painel administrativo

1. **Iniciar o servidor Django**:
   ```bash
   cd daytrack_backend
   venv\Scripts\activate
   python manage.py runserver
   ```

2. **Acessar o painel administrativo**:
   - Abra o navegador e vá para: `http://127.0.0.1:8000/admin/`
   - Faça login com um usuário superusuário

## 👤 Funcionalidades do Painel de Usuários

### 📋 Visualização de Usuários
- Lista completa de todos os usuários cadastrados
- Colunas: Email, Nome de usuário, Nome completo, Status (ativo/inativo), Staff, 2FA, Data de criação
- Filtros por status, staff, 2FA e data de criação
- Busca por email, nome de usuário ou nome completo

### ➕ Criação de Usuários
- Botão "Adicionar Usuário" para criar novos usuários
- Campos obrigatórios: nome de usuário, email, nome, sobrenome, senha
- Definição de permissões (staff, superusuário, grupos)

### ✏️ Edição de Usuários
- Clique no usuário na lista para editar
- Alteração de dados pessoais
- Gerenciamento de permissões
- Ativação/desativação de 2FA

### 🔛 Ativação/Desativação de Usuários
- **Ações individuais**: Botões "Ativar" e "Desativar" em cada linha de usuário
- **Ações em lote**: Selecione múltiplos usuários e use as ações em massa
- Usuários desativados não podem fazer login no sistema

### 🗑️ Exclusão de Usuários
- Exclusão individual através da página de edição
- Exclusão em lote selecionando usuários e usando a ação "Excluir"

## ⚙️ Ações Disponíveis

### Ações Individuais (na lista de usuários)
- **Ativar**: Reativa um usuário desativado
- **Desativar**: Impede que um usuário faça login sem excluir sua conta
- **Editar**: Acessa a página de edição detalhada

### Ações em Lote (selecionando múltiplos usuários)
- **Ativar usuários selecionados**: Ativa todos os usuários selecionados
- **Desativar usuários selecionados**: Desativa todos os usuários selecionados
- **Excluir usuários selecionados**: Remove permanentemente os usuários selecionados

## 🔐 Segurança

- Apenas usuários com permissão de staff podem acessar o painel administrativo
- Superusuários têm acesso completo a todas as funcionalidades
- Logs de todas as ações administrativas são registrados automaticamente

## 🎯 Dicas de Uso

1. **Desative em vez de excluir**: Para manter a integridade dos dados, prefira desativar usuários em vez de excluí-los
2. **Use filtros**: Utilize os filtros para encontrar usuários com características específicas
3. **Busca eficiente**: Use a barra de busca para encontrar usuários por nome, email ou username
4. **Ações em lote**: Para operações em múltiplos usuários, selecione-os e use as ações em lote