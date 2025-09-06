# 🚀 Deploy no Portainer - DayTrack

## ❌ **NÃO USE** `docker-compose.yml` no Portainer

O `docker-compose.yml` é para desenvolvimento local e tem opções que o Portainer não suporta:
- `build` (construção de imagem)
- `ports` (mapeamento de portas)
- `restart: always` (modo diferente)

## ✅ **USE** `portainer-stack-production.yml` no Portainer

### 📋 **Passos para Deploy:**

1. **Acesse o Portainer**
2. **Vá em Stacks > Add Stack**
3. **Cole o conteúdo** do `portainer-stack-production.yml`
4. **Faça upload dos arquivos**:
   - `daytrack_backend/` (diretório completo)
5. **Deploy!**

### 🔧 **Diferenças:**

**docker-compose.yml** (desenvolvimento):
```yaml
services:
  backend:
    build:  # ❌ Não suportado no Portainer
      context: .
      dockerfile: Dockerfile.backend
    ports:  # ❌ Não suportado no Portainer
      - "8000:8000"
    restart: always  # ❌ Modo diferente
```

**portainer-stack-production.yml** (produção):
```yaml
services:
  daytrack_web:
    image: python:3.11-slim  # ✅ Imagem pronta
    deploy:  # ✅ Modo swarm
      mode: replicated
      replicas: 1
    volumes:  # ✅ Volume montado
      - ./daytrack_backend:/app
```

### 🌐 **URL após deploy:**
- **Sistema**: https://daytrack.niochat.com.br
- **Admin**: https://daytrack.niochat.com.br/admin

---

**🎯 Use sempre `portainer-stack-production.yml` no Portainer!**
