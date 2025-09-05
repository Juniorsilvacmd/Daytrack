#!/bin/bash

# Script para build e push das imagens Docker
# Execute: chmod +x build-and-push.sh && ./build-and-push.sh

echo "🚀 Iniciando build e push das imagens Docker..."

# Definir variáveis
REGISTRY="your-registry.com"  # Substitua pelo seu registry
PROJECT_NAME="daytrack"
FRONTEND_IMAGE="$REGISTRY/$PROJECT_NAME-frontend"
BACKEND_IMAGE="$REGISTRY/$PROJECT_NAME-backend"

# Build da imagem do frontend
echo "📦 Building frontend image..."
docker build -f Dockerfile.frontend -t $FRONTEND_IMAGE:latest .

if [ $? -eq 0 ]; then
    echo "✅ Frontend image built successfully"
else
    echo "❌ Frontend image build failed"
    exit 1
fi

# Build da imagem do backend
echo "📦 Building backend image..."
docker build -f Dockerfile.backend -t $BACKEND_IMAGE:latest .

if [ $? -eq 0 ]; then
    echo "✅ Backend image built successfully"
else
    echo "❌ Backend image build failed"
    exit 1
fi

# Push das imagens (descomente quando tiver registry configurado)
# echo "📤 Pushing images to registry..."
# docker push $FRONTEND_IMAGE:latest
# docker push $BACKEND_IMAGE:latest

echo "🎉 Build completed successfully!"
echo "📋 Images created:"
echo "   - $FRONTEND_IMAGE:latest"
echo "   - $BACKEND_IMAGE:latest"
echo ""
echo "📝 Next steps:"
echo "   1. Configure your Docker registry"
echo "   2. Uncomment push commands in this script"
echo "   3. Update portainer-stack.yml with your registry URLs"
echo "   4. Deploy the stack in Portainer"
