# Configuração do Docker Compose para Portainer

Este arquivo é usado pelo Portainer para implantar a stack do DayTrack.

## Variáveis de Ambiente

As seguintes variáveis de ambiente devem ser configuradas no Portainer:

- `SECRET_KEY`: Chave secreta do Django (obrigatória)
- `DATABASE_URL`: URL de conexão com o banco de dados PostgreSQL
- `ALLOWED_HOSTS`: Lista de hosts permitidos separados por vírgula
- `CORS_ALLOWED_ORIGINS`: Lista de origens CORS permitidas separadas por vírgula
- `DOMAIN_NAME`: Nome de domínio para o Traefik configurar o roteamento

## Deploy via GitHub Actions

Este stack é automaticamente implantado via GitHub Actions quando há push na branch main.

## Exemplo de configuração de variáveis de ambiente

```
SECRET_KEY=django-insecure-production-key-change-this-in-production
DATABASE_URL=postgresql://postgres:password@localhost:5432/daytrack
ALLOWED_HOSTS=daytrack.seudominio.com,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://daytrack.seudominio.com,http://localhost:3000
DOMAIN_NAME=daytrack.seudominio.com
```