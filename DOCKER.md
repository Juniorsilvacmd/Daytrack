# 🐳 Dockerização do DayTrack

Este documento explica como dockerizar e deployar o sistema DayTrack usando Docker e Portainer com Traefik.

## 📋 Arquivos Criados

### Dockerfiles
- `Dockerfile.frontend` - Frontend React com serve
- `Dockerfile.backend` - Backend Django com Gunicorn

### Configurações
- `docker-compose.yml` - Para desenvolvimento local
- `portainer-stack.yml` - Stack para Portainer com Traefik
- `build-and-push.sh` - Script para build e push das imagens
- `.dockerignore` - Otimização do build

### Variáveis de Ambiente
- `daytrack_backend/env.example` - Exemplo para backend
- `env.example` - Exemplo para frontend

## 🚀 Como Usar

### 1. Build Local (Desenvolvimento)

```bash
# Build das imagens
docker-compose build

# Executar localmente
docker-compose up -d
```

### 2. Build para Produção

```bash
# Dar permissão ao script
chmod +x build-and-push.sh

# Executar build
./build-and-push.sh
```

### 3. Deploy no Portainer

1. **Configure seu Registry Docker** (se necessário)
2. **Atualize o `portainer-stack.yml`** com as URLs das suas imagens
3. **Crie a stack no Portainer** usando o arquivo `portainer-stack.yml`
4. **Configure as variáveis de ambiente** no Portainer

## 🌐 Domínios Configurados

- **Frontend**: `daytrack.niochat.com.br` (porta 3000)
- **Backend**: `django.niochat.com.br` (porta 8000)

## ⚙️ Variáveis de Ambiente Necessárias

### Backend (Django)
```env
DEBUG=False
SECRET_KEY=your-super-secret-key-here
ALLOWED_HOSTS=django.niochat.com.br,localhost,127.0.0.1
DATABASE_URL=postgresql://postgres:password@host:port/database
CORS_ALLOWED_ORIGINS=https://daytrack.niochat.com.br
```

### Frontend (React)
```env
VITE_API_URL=https://django.niochat.com.br/api/v1
```

## 🔧 Configurações do Traefik

A stack inclui:
- ✅ **SSL automático** com Let's Encrypt
- ✅ **Health checks** para ambos os serviços
- ✅ **Headers de segurança**
- ✅ **Load balancing**
- ✅ **PassHostHeader** para funcionamento correto

## 📦 Recursos Alocados

### Frontend
- **CPU**: 0.5 cores (limite), 0.25 cores (reserva)
- **RAM**: 512MB (limite), 256MB (reserva)

### Backend
- **CPU**: 1 core (limite), 0.5 cores (reserva)
- **RAM**: 1024MB (limite), 512MB (reserva)

## 🔄 Atualizações Automáticas

Para configurar atualizações automáticas do GitHub:

1. **Configure webhook** no GitHub apontando para seu Portainer
2. **Use tags** nas suas imagens (ex: `v1.0.0`)
3. **Configure auto-update** no Portainer

## 🐛 Troubleshooting

### Problemas Comuns

1. **CORS Error**: Verifique `CORS_ALLOWED_ORIGINS` no backend
2. **Database Connection**: Verifique `DATABASE_URL` e conectividade
3. **SSL Issues**: Verifique configuração do Let's Encrypt
4. **Health Check Failed**: Verifique se os serviços estão respondendo nas portas corretas

### Logs

```bash
# Ver logs do frontend
docker logs daytrack-frontend

# Ver logs do backend
docker logs daytrack-backend
```

## 📝 Próximos Passos

1. ✅ Configurar registry Docker
2. ✅ Configurar CI/CD com GitHub Actions
3. ✅ Implementar backup automático do banco
4. ✅ Configurar monitoramento com Uptime Kuma
5. ✅ Implementar logs centralizados
