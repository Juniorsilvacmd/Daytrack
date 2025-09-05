# Daytrack Backend

Backend completo em Django com Django REST Framework para o sistema de controle financeiro Daytrack.

## 🚀 Funcionalidades

### ✅ Sistema de Autenticação Seguro
- **Registro de usuários** com validação de dados
- **Login com JWT** (access e refresh token)
- **Logout** com invalidação do token
- **Reset de senha** via e-mail
- **Senhas seguras** com validação do Django
- **Suporte para 2FA** opcional (Google Authenticator/TOTP)
- **Códigos de backup** para 2FA
- **Log de tentativas de login** para segurança

### ✅ Painel de Superadmin
- **Django Admin** totalmente configurado
- **Superadmin pode**:
  - Criar, editar e remover usuários
  - Ativar/desativar contas
  - Definir se um usuário é admin ou não
  - Visualizar logs de login
  - Gerenciar transações e relatórios

### ✅ Isolamento de Dados
- **Cada usuário** só pode acessar os próprios registros
- **Superadmin** pode acessar dados de todos
- **Permissions e queryset** filtrando dados por usuário logado
- **Segurança total** de dados entre usuários

### ✅ Sistema Financeiro Completo
- **Conta bancária** por usuário
- **Transações** (ganhos e perdas)
- **Relatórios mensais** automáticos
- **Estatísticas do dashboard** em tempo real
- **Categorias e tags** para organização
- **Cálculos automáticos** de saldo e crescimento

## 🛠️ Tecnologias

- **Django 4.2.7** - Framework web
- **Django REST Framework 3.14.0** - API REST
- **JWT (SimpleJWT)** - Autenticação
- **PostgreSQL/SQLite** - Banco de dados
- **CORS Headers** - Cross-origin requests
- **Django Filter** - Filtros avançados
- **PyOTP** - 2FA com Google Authenticator
- **QRCode** - Geração de QR codes para 2FA

## 📋 Pré-requisitos

- Python 3.8+
- pip
- PostgreSQL (opcional, SQLite para desenvolvimento)

## 🚀 Instalação

1. **Clone o repositório**:
```bash
git clone <repository-url>
cd daytrack_backend
```

2. **Crie um ambiente virtual**:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac
```

3. **Instale as dependências**:
```bash
pip install -r requirements-dev.txt
```

4. **Configure as variáveis de ambiente**:
```bash
# Copie o arquivo de exemplo
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

5. **Execute as migrações**:
```bash
python manage.py migrate
```

6. **Crie um superusuário**:
```bash
python manage.py createsuperuser
```

7. **Inicie o servidor**:
```bash
python manage.py runserver
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)

```env
# Django Settings
SECRET_KEY=sua-secret-key-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3

# Email Settings (para reset de senha)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seu-email@gmail.com
EMAIL_HOST_PASSWORD=sua-senha-de-app
DEFAULT_FROM_EMAIL=noreply@daytrack.com

# Supabase (para produção)
SUPABASE_URL=sua-url-supabase
SUPABASE_KEY=sua-chave-supabase
```

## 📚 Endpoints da API

### Autenticação (`/api/v1/auth/`)

- `POST /register/` - Registro de usuário
- `POST /login/` - Login com JWT
- `POST /logout/` - Logout (invalida token)
- `GET /profile/` - Perfil do usuário
- `PUT /profile/` - Atualizar perfil
- `POST /change-password/` - Alterar senha
- `POST /password-reset/` - Solicitar reset de senha
- `POST /password-reset-confirm/` - Confirmar reset de senha
- `GET /2fa/setup/` - Configurar 2FA (QR code)
- `POST /2fa/setup/` - Confirmar configuração 2FA
- `POST /2fa/disable/` - Desabilitar 2FA
- `GET /login-attempts/` - Histórico de logins
- `GET /stats/` - Estatísticas do usuário

### Transações (`/api/v1/`)

- `GET /bank-account/` - Conta bancária do usuário
- `PUT /bank-account/` - Atualizar saldo da conta
- `GET /bank-account/summary/` - Resumo da conta
- `GET /transactions/` - Listar transações
- `POST /transactions/` - Criar transação
- `GET /transactions/{id}/` - Detalhes da transação
- `PUT /transactions/{id}/` - Atualizar transação
- `DELETE /transactions/{id}/` - Deletar transação
- `GET /transactions/summary/` - Resumo por período
- `GET /monthly-reports/` - Relatórios mensais
- `POST /monthly-reports/generate/` - Gerar relatório mensal
- `GET /dashboard-stats/` - Estatísticas do dashboard
- `GET /categories/` - Categorias de transações
- `POST /categories/` - Criar categoria
- `GET /tags/` - Tags de transações
- `POST /tags/` - Criar tag

## 🔐 Segurança

### Autenticação JWT
- **Access Token**: 60 minutos
- **Refresh Token**: 7 dias
- **Rotação automática** de tokens
- **Blacklist** de tokens inválidos

### 2FA (Two-Factor Authentication)
- **Google Authenticator** compatível
- **TOTP** (Time-based One-Time Password)
- **Códigos de backup** para emergências
- **QR Code** para configuração fácil

### Isolamento de Dados
- **Row Level Security** por usuário
- **Filtros automáticos** em todas as queries
- **Permissões granulares** por endpoint
- **Logs de auditoria** para todas as ações

## 👨‍💼 Painel Admin

Acesse `/admin/` para gerenciar:

- **Usuários**: Criar, editar, ativar/desativar
- **Contas Bancárias**: Visualizar saldos
- **Transações**: Monitorar todas as operações
- **Relatórios**: Análise mensal
- **Logs de Login**: Segurança e auditoria
- **Categorias e Tags**: Organização

## 🧪 Testes

```bash
# Executar testes
python manage.py test

# Testes específicos
python manage.py test authentication
python manage.py test transactions
```

## 📊 Monitoramento

- **Logs**: `logs/django.log`
- **Health Check**: `/health/`
- **Admin**: `/admin/`

## 🚀 Deploy

### Produção com PostgreSQL

1. **Configure PostgreSQL**:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/daytrack
```

2. **Instale psycopg2**:
```bash
pip install psycopg2-binary
```

3. **Configure variáveis de produção**:
```env
DEBUG=False
SECRET_KEY=sua-secret-key-super-secreta
ALLOWED_HOSTS=seu-dominio.com
```

4. **Execute migrações**:
```bash
python manage.py migrate
python manage.py collectstatic
```

## 📝 Exemplos de Uso

### Registro de Usuário
```bash
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario",
    "email": "usuario@email.com",
    "first_name": "João",
    "last_name": "Silva",
    "password": "senha123",
    "password_confirm": "senha123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "password": "senha123"
  }'
```

### Criar Transação
```bash
curl -X POST http://localhost:8000/api/v1/transactions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -d '{
    "type": "gain",
    "amount": "100.00",
    "description": "Venda de produto",
    "date": "2025-01-05"
  }'
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Email**: contato@daytrack.com
- **Documentação**: `/swagger/` (quando disponível)
- **Issues**: GitHub Issues

---

**Daytrack Backend** - Sistema completo de controle financeiro com segurança máxima! 🚀💰