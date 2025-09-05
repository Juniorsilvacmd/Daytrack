# 🔧 Troubleshooting - DayTrack Docker

## ❌ Erro: "Unable to get task: task not found"

Este erro acontece quando o Portainer não consegue encontrar ou executar a task Docker. Aqui estão as soluções:

### 🎯 **Solução 1: Usar Build Automático**

Use o arquivo `portainer-stack-build.yml` que faz build direto do GitHub:

1. **Copie o conteúdo** de `portainer-stack-build.yml`
2. **Cole no Portainer** na seção Stack
3. **Configure as variáveis de ambiente**
4. **Deploy** - O Portainer fará o build automaticamente

### 🎯 **Solução 2: Build Manual das Imagens**

Se você tem Docker instalado no servidor:

```bash
# Clone o repositório
git clone https://github.com/Juniorsilvacmd/Daytrack.git
cd Daytrack

# Build das imagens
docker build -f Dockerfile.frontend -t daytrack-frontend:latest .
docker build -f Dockerfile.backend -t daytrack-backend:latest .

# Use a stack original (portainer-stack.yml)
```

### 🎯 **Solução 3: Usar Docker Hub**

1. **Build e push** para Docker Hub:
```bash
# Build
docker build -f Dockerfile.frontend -t seuusuario/daytrack-frontend:latest .
docker build -f Dockerfile.backend -t seuusuario/daytrack-backend:latest .

# Push
docker push seuusuario/daytrack-frontend:latest
docker push seuusuario/daytrack-backend:latest
```

2. **Atualize** `portainer-stack.yml` com suas imagens:
```yaml
image: seuusuario/daytrack-frontend:latest
image: seuusuario/daytrack-backend:latest
```

## 🔍 **Outros Problemas Comuns**

### CORS Error
```env
CORS_ALLOWED_ORIGINS=https://daytrack.niochat.com.br
```

### Database Connection Error
```env
DATABASE_URL=postgresql://postgres:password@host:port/database
```

### SSL Certificate Error
- Verifique se o domínio aponta para o servidor
- Aguarde alguns minutos para o Let's Encrypt gerar o certificado

### Health Check Failed
- Verifique se as portas 3000 (frontend) e 8000 (backend) estão corretas
- Verifique se os serviços estão respondendo

## 📋 **Variáveis de Ambiente Necessárias**

### Backend
```env
DEBUG=False
SECRET_KEY=sua-chave-secreta-aqui
ALLOWED_HOSTS=django.niochat.com.br,localhost,127.0.0.1
DATABASE_URL=postgresql://postgres:Semfim01@@db.flojrapvlpueanbpvdab.supabase.co:5432/postgres
CORS_ALLOWED_ORIGINS=https://daytrack.niochat.com.br
```

### Frontend
```env
VITE_API_URL=https://django.niochat.com.br/api/v1
```

## 🚀 **Recomendação**

**Use o arquivo `portainer-stack-build.yml`** - ele resolve automaticamente o problema de imagens não encontradas fazendo build direto do GitHub.
