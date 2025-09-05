# DayTrack - Sistema de Gestão Financeira

![DayTrack Logo](public/logo.png)

## 📋 Sobre o Projeto

O **DayTrack** é um sistema completo de gestão financeira desenvolvido para controle de banca e operações financeiras. O sistema oferece uma interface moderna, responsiva e intuitiva para acompanhar saldos, transações e relatórios financeiros.

## ✨ Funcionalidades

### 🔐 Autenticação Segura
- **Login por username** com JWT (access e refresh token)
- **Registro de usuários** com validação
- **Logout** com invalidação de token
- **2FA opcional** (Google Authenticator/TOTP)
- **Reset de senha** via e-mail

### 💰 Gestão Financeira
- **Controle de saldo** atual da banca
- **Registro de operações** (ganhos/perdas)
- **Histórico completo** de transações
- **Relatórios mensais** detalhados
- **Dashboard** com estatísticas em tempo real

### 📊 Visualizações
- **Gráfico de evolução** da banca (barras + linha)
- **Cards de estatísticas** (saldo, resultado diário, acumulado mensal, crescimento)
- **Relatórios mensais** com análise detalhada
- **Interface responsiva** para mobile e desktop

### ⚙️ Configurações
- **Edição de perfil** (nome, sobrenome, email)
- **Alteração de senha**
- **Tema escuro/claro**
- **Configurações PWA** para instalação mobile

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Recharts** para gráficos
- **Lucide React** para ícones
- **date-fns** para manipulação de datas

### Backend
- **Django 4.2.7** com Django REST Framework
- **JWT Authentication** (djangorestframework-simplejwt)
- **PostgreSQL** (Supabase)
- **CORS** para comunicação frontend/backend
- **Django Admin** para superadmin

### Banco de Dados
- **Supabase PostgreSQL** para produção
- **SQLite** para desenvolvimento local

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- Python 3.8+
- Git

### Frontend (React)

```bash
# Clone o repositório
git clone https://github.com/Juniorsilvacmd/Daytrack.git
cd Daytrack

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Backend (Django)

```bash
# Navegue para o diretório do backend
cd daytrack_backend

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Execute as migrações
python manage.py migrate

# Crie um superusuário
python manage.py createsuperuser

# Inicie o servidor
python manage.py runserver
```

## 🔧 Configuração do Supabase

1. **Crie uma conta** no [Supabase](https://supabase.com)
2. **Crie um novo projeto**
3. **Configure as credenciais** no arquivo `daytrack_backend/daytrack_backend/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': 'sua_senha',
        'HOST': 'db.seuprojeto.supabase.co',
        'PORT': '5432',
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
}
```

4. **Execute as migrações** no Supabase:
```bash
python manage.py migrate
```

## 📱 PWA (Progressive Web App)

O DayTrack é uma PWA completa, permitindo:
- **Instalação** em dispositivos móveis
- **Funcionamento offline** (com cache)
- **Notificações** push (futuro)
- **Experiência nativa** em mobile

### Instalação Mobile
1. Acesse `https://seudominio.com` no mobile
2. Toque em "Adicionar à tela inicial"
3. Use como app nativo

## 🎨 Interface

### Tema Escuro
- Interface moderna com tema escuro por padrão
- Alternância entre tema claro/escuro
- Cores consistentes em toda aplicação

### Responsividade
- **Mobile-first** design
- **Adaptação automática** para diferentes telas
- **Touch-friendly** para dispositivos móveis

## 🔒 Segurança

- **Autenticação JWT** com refresh tokens
- **Senhas criptografadas** com bcrypt
- **CORS configurado** para produção
- **Validação de dados** no frontend e backend
- **Isolamento de dados** por usuário

## 📊 Estrutura do Projeto

```
Daytrack/
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── services/           # Serviços de API
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utilitários
│   └── types/              # Tipos TypeScript
├── daytrack_backend/        # Backend Django
│   ├── authentication/     # App de autenticação
│   ├── transactions/       # App de transações
│   └── daytrack_backend/   # Configurações Django
├── public/                 # Arquivos públicos
└── requirements.txt        # Dependências Python
```

## 🚀 Deploy

### Frontend (Vercel/Netlify)
```bash
npm run build
# Upload da pasta dist/
```

### Backend (Railway/Heroku)
```bash
# Configure as variáveis de ambiente
# Deploy automático via Git
```

## 📝 API Endpoints

### Autenticação
- `POST /api/v1/auth/register/` - Registro de usuário
- `POST /api/v1/auth/login/` - Login
- `POST /api/v1/auth/logout/` - Logout
- `POST /api/v1/auth/token/refresh/` - Refresh token

### Transações
- `GET /api/v1/bank-accounts/` - Listar contas
- `POST /api/v1/bank-accounts/` - Criar conta
- `GET /api/v1/transactions/` - Listar transações
- `POST /api/v1/transactions/` - Criar transação
- `DELETE /api/v1/transactions/{id}/` - Deletar transação

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvedor

**Junior Silva**
- Email: juniorsousacmd@gmail.com
- GitHub: [@Juniorsilvacmd](https://github.com/Juniorsilvacmd)

## 🎯 Roadmap

- [ ] **Notificações push** para operações
- [ ] **Relatórios em PDF** para exportação
- [ ] **Múltiplas contas** por usuário
- [ ] **Categorização** de transações
- [ ] **Metas financeiras** e alertas
- [ ] **Integração** com APIs de criptomoedas
- [ ] **Backup automático** de dados

---

**© 2025 DayTrack. Versão 1.0.0**