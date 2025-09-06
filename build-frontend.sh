#!/bin/bash

echo "🚀 Iniciando build do frontend DayTrack..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

# Verificar se o build foi bem-sucedido
if [ -d "dist" ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📁 Arquivos gerados em: ./dist"
    ls -la dist/
else
    echo "❌ Erro no build!"
    exit 1
fi

echo "🎉 Frontend pronto para deploy!"
