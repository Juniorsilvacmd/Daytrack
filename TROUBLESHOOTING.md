# 🔧 Troubleshooting - DayTrack Docker

## ✅ **Stack Única e Funcional**

Use apenas o arquivo `portainer-stack.yml` - ele foi testado e funciona.

## 🚀 **Como Deployar**

1. **Copie o conteúdo** de `portainer-stack.yml`
2. **Cole no Portainer** na seção Stack
3. **Configure as variáveis de ambiente** (opcional)
4. **Deploy** - Funcionará imediatamente

## 🌐 **Domínios Configurados**

- **Frontend**: `daytrack.niochat.com.br` - Página de status
- **Backend**: `django.niochat.com.br/api/v1/` - API de teste

## ⚙️ **Variáveis de Ambiente (Opcionais)**

```env
DEBUG=False
SECRET_KEY=django-insecure-production-key-change-this
ALLOWED_HOSTS=django.niochat.com.br,localhost,127.0.0.1
DATABASE_URL=postgresql://postgres:Semfim01@@db.flojrapvlpueanbpvdab.supabase.co:5432/postgres
CORS_ALLOWED_ORIGINS=https://daytrack.niochat.com.br
```

## 🔍 **Teste Após Deploy**

1. **Acesse** `https://daytrack.niochat.com.br` - Deve mostrar página de status
2. **Acesse** `https://django.niochat.com.br/api/v1/` - Deve retornar JSON com mensagem

## 🐛 **Problemas Comuns**

### SSL Certificate Error
- Aguarde alguns minutos para o Let's Encrypt gerar o certificado
- Verifique se o domínio aponta para o servidor

### Health Check Failed
- Verifique se as portas 80 (frontend) e 8000 (backend) estão corretas
- Aguarde alguns minutos para os containers iniciarem

### CORS Error
- Verifique se `CORS_ALLOWED_ORIGINS` está configurado corretamente

## 📋 **Recursos Alocados**

- **Frontend**: 0.5 CPU, 512MB RAM
- **Backend**: 1 CPU, 1024MB RAM

## 🎯 **Próximos Passos**

Após confirmar que funciona:
1. ✅ Substitua o frontend por build real do React
2. ✅ Substitua o backend por Django completo
3. ✅ Configure banco de dados Supabase
4. ✅ Implemente autenticação JWT