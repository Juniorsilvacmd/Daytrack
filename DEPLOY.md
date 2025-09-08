# 🚀 Deploy DayTrack

## 📁 Arquivos Essenciais

- **Dockerfile**: Build do Django com gunicorn
- **docker-compose.portainer.yml**: Stack específica para Portainer
- **docker-compose.yml**: Stack para desenvolvimento local

## 🚀 Deploy no Portainer

### Método Repository (Recomendado)

1. **Portainer > Stacks > Add Stack**
2. **Selecione "Repository"**
3. **Configure:**
   - Repository URL: `https://github.com/Juniorsilvacmd/Daytrack.git`
   - Repository reference: `refs/heads/main`
   - Compose file path: `docker-compose.portainer.yml`
4. **Configure as variáveis de ambiente:**
   - `SECRET_KEY`: Chave secreta do Django
   - `DATABASE_URL`: URL de conexão com o banco de dados
   - `ALLOWED_HOSTS`: Lista de hosts permitidos
   - `CORS_ALLOWED_ORIGINS`: Lista de origens CORS permitidas
   - `DOMAIN_NAME`: Nome de domínio para o Traefik
5. **Deploy!**

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