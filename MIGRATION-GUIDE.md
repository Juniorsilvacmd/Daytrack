# 🚀 Guia de Migração para Produção

## 📋 **Status Atual**
- ✅ **Infraestrutura funcionando** - Docker + Traefik + SSL
- ✅ **Domínios ativos** - daytrack.niochat.com.br e django.niochat.com.br
- ✅ **Stack de teste** funcionando perfeitamente

## 🎯 **Próximos Passos**

### **OPÇÃO 1: Deploy Gradual (Recomendado)**

1. **Mantenha a stack atual** funcionando
2. **Teste a nova stack** em paralelo
3. **Migre quando estiver tudo funcionando**

### **OPÇÃO 2: Deploy Direto**

1. **Pare a stack atual** no Portainer
2. **Deploy a nova stack** `portainer-stack-production.yml`
3. **Aguarde o build** (pode demorar alguns minutos)

## 🔧 **Diferenças da Stack de Produção**

### **Frontend (React Real)**
- ✅ **Build do React** - Sistema completo
- ✅ **Nginx** - Servidor otimizado
- ✅ **Variáveis de ambiente** - API URL configurada
- ✅ **PWA** - Instalável em dispositivos móveis

### **Backend (Django Real)**
- ✅ **Django completo** - API REST funcional
- ✅ **Gunicorn** - Servidor de produção
- ✅ **Migrações automáticas** - Banco atualizado
- ✅ **Arquivos estáticos** - CSS/JS coletados
- ✅ **Supabase** - Banco de dados conectado

## ⚙️ **Configurações Necessárias**

### **Variáveis de Ambiente**
```env
# Backend
DEBUG=False
SECRET_KEY=sua-chave-secreta-super-segura
ALLOWED_HOSTS=django.niochat.com.br
DATABASE_URL=postgresql://postgres:Semfim01@@db.flojrapvlpueanbpvdab.supabase.co:5432/postgres
CORS_ALLOWED_ORIGINS=https://daytrack.niochat.com.br

# Frontend
VITE_API_URL=https://django.niochat.com.br/api/v1
```

## 🚀 **Como Fazer o Deploy**

### **1. Preparação**
- ✅ Verifique se o Supabase está funcionando
- ✅ Confirme que os domínios estão corretos
- ✅ Tenha as credenciais do banco de dados

### **2. Deploy no Portainer**
1. **Copie** o conteúdo de `portainer-stack-production.yml`
2. **Cole no Portainer** na seção Stack
3. **Configure** as variáveis de ambiente
4. **Deploy** - Aguarde o build (5-10 minutos)

### **3. Verificação**
- ✅ **Frontend**: `https://daytrack.niochat.com.br` - Sistema completo
- ✅ **Backend**: `https://django.niochat.com.br/api/v1/` - API funcionando
- ✅ **Login**: Teste com usuário admin
- ✅ **Funcionalidades**: Dashboard, transações, relatórios

## 🔍 **Troubleshooting**

### **Build Falha**
- Verifique logs do Portainer
- Confirme conectividade com GitHub
- Aguarde mais tempo (build pode ser lento)

### **Banco de Dados**
- Verifique credenciais do Supabase
- Confirme que as tabelas existem
- Teste conexão manual

### **CORS Errors**
- Verifique `CORS_ALLOWED_ORIGINS`
- Confirme URLs dos domínios
- Teste com curl/Postman

## 📊 **Recursos Alocados**

### **Frontend**
- **CPU**: 1 core (limite), 0.5 cores (reserva)
- **RAM**: 1024MB (limite), 512MB (reserva)

### **Backend**
- **CPU**: 2 cores (limite), 1 core (reserva)
- **RAM**: 2048MB (limite), 1024MB (reserva)

## 🎉 **Resultado Final**

Após o deploy bem-sucedido, você terá:

- ✅ **Sistema DayTrack completo** funcionando
- ✅ **Autenticação JWT** com login/logout
- ✅ **Dashboard** com gráficos e estatísticas
- ✅ **Gestão de transações** completa
- ✅ **Relatórios mensais** automáticos
- ✅ **PWA** instalável em mobile
- ✅ **SSL** automático com Let's Encrypt
- ✅ **Deploy automático** via GitHub

**Pronto para usar em produção!** 🚀
