# 🚀 Guia de Deploy - DayTrack

## 📋 Pré-requisitos

- ✅ Portainer configurado
- ✅ Traefik funcionando
- ✅ Domínios configurados:
  - `daytrack.niochat.com.br` (frontend)
  - `django.niochat.com.br` (backend/admin)

## 🔧 Configuração do Backend

### 1. Variáveis de Ambiente

Crie um arquivo `.env` no diretório `daytrack_backend/`:

```bash
DEBUG=False
SECRET_KEY=sua-chave-secreta-super-segura-aqui
ALLOWED_HOSTS=daytrack.niochat.com.br,django.niochat.com.br,localhost,127.0.0.1
DATABASE_URL=postgresql://postgres.flojrapvlpueanbpvdab:Semfim01@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
CORS_ALLOWED_ORIGINS=https://daytrack.niochat.com.br,http://localhost:3000,http://localhost:5173
```

### 2. Migrações do Banco

Execute as migrações antes do deploy:

```bash
cd daytrack_backend
python manage.py migrate
python manage.py collectstatic --noinput
```

## 🎨 Build do Frontend

### 1. Instalar Dependências

```bash
npm install
```

### 2. Build do Projeto

```bash
npm run build
```

### 3. Verificar Build

O diretório `dist/` deve conter os arquivos estáticos do React.

## 🐳 Deploy no Portainer

### 1. Upload dos Arquivos

Faça upload dos seguintes arquivos para o Portainer:
- `portainer-stack-production.yml`
- `daytrack_backend/` (diretório completo)
- `dist/` (diretório do build do frontend)

### 2. Configurar Stack

1. Acesse o Portainer
2. Vá em **Stacks** > **Add Stack**
3. Cole o conteúdo do `portainer-stack-production.yml`
4. Configure as variáveis de ambiente se necessário
5. Clique em **Deploy the stack**

### 3. Verificar Deploy

- **Frontend**: https://daytrack.niochat.com.br
- **Backend/Admin**: https://django.niochat.com.br/admin

## 🔍 Troubleshooting

### Problemas Comuns

1. **Erro 502 Bad Gateway**
   - Verifique se o backend está rodando
   - Confirme as variáveis de ambiente
   - Verifique os logs do container

2. **Erro de CORS**
   - Confirme `CORS_ALLOWED_ORIGINS` no `.env`
   - Verifique se o domínio está correto

3. **Erro de Banco de Dados**
   - Confirme `DATABASE_URL` no `.env`
   - Execute as migrações: `python manage.py migrate`

### Logs dos Containers

```bash
# Logs do frontend
docker logs daytrack-frontend

# Logs do backend
docker logs daytrack-backend
```

## 📊 Monitoramento

### Health Checks

- **Frontend**: https://daytrack.niochat.com.br
- **Backend**: https://django.niochat.com.br/admin
- **API**: https://django.niochat.com.br/api/v1/

### Métricas

- CPU e memória dos containers
- Logs de acesso do Traefik
- Status do SSL (Let's Encrypt)

## 🔄 Atualizações

### Frontend

1. Faça as alterações no código
2. Execute `npm run build`
3. Faça upload do novo `dist/`
4. Reinicie o stack no Portainer

### Backend

1. Faça as alterações no código
2. Faça upload dos arquivos alterados
3. Reinicie o stack no Portainer

## 🛡️ Segurança

### SSL/TLS

- ✅ Let's Encrypt automático via Traefik
- ✅ HTTPS obrigatório
- ✅ Certificados renovados automaticamente

### Variáveis Sensíveis

- ✅ `SECRET_KEY` em variáveis de ambiente
- ✅ `DATABASE_URL` protegida
- ✅ `DEBUG=False` em produção

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs dos containers
2. Confirme as variáveis de ambiente
3. Teste a conectividade com o banco
4. Verifique o status do Traefik

---

**🎉 Sistema DayTrack em Produção!**
