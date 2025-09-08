# 🚀 Deploy DayTrack

## 📁 Arquivos Essenciais

- **Dockerfile**: Build do Django com gunicorn
- **docker-compose.yml**: Stack completa para Portainer

## 🚀 Deploy no Portainer

### Método Repository (Recomendado)

1. **Portainer > Stacks > Add Stack**
2. **Selecione "Repository"**
3. **Configure:**
   - Repository URL: `https://github.com/Juniorsilvacmd/Daytrack.git`
   - Repository reference: `refs/heads/main`
   - Compose file path: `docker-compose.yml`
4. **Deploy!**

## 🌐 URL

- **Sistema**: https://daytrack.niochat.com.br
- **Admin**: https://daytrack.niochat.com.br/admin

## ⚙️ Configuração

- Python 3.11-slim
- Django + Gunicorn
- Supabase PostgreSQL
- SSL automático (Let's Encrypt)
- Rede: nioNet

---

**🎯 Pronto para produção!**