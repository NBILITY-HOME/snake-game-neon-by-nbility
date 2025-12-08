# 🐳 Snake 2025 - Guide Docker

## 🚀 Démarrage Rapide

### Option 1 : Utiliser Make (Recommandé)
```bash
# Construire et lancer le jeu
make build
make run

# Ou en une seule commande
make quick
```

Le jeu sera accessible sur http://localhost:8080

### Option 2 : Commandes Docker
```bash
# Construire l'image
docker build -t snake-2025 .

# Lancer le conteneur
docker run -d -p 8080:80 --name snake-2025 snake-2025
```

### Option 3 : Docker Compose
```bash
# Lancer en production
docker-compose up -d

# Lancer en développement
docker-compose -f docker-compose.dev.yml up
```

## 📋 Commandes Disponibles

### Makefile
```bash
make help      # Afficher l'aide
make build     # Construire l'image
make run       # Lancer en production
make dev       # Lancer en développement
make stop      # Arrêter le conteneur
make clean     # Nettoyer tout
make logs      # Voir les logs
make shell     # Accéder au shell
make status    # Vérifier l'état
```

### Docker Compose
```bash
# Production
docker-compose up -d      # Lancer
docker-compose down       # Arrêter
docker-compose restart    # Redémarrer
docker-compose logs -f    # Logs

# Développement
docker-compose -f docker-compose.dev.yml up
```

## 🔧 Configuration

### Ports
- **Production** : 8080 (modifiable dans docker-compose.yml)
- **Développement** : 5173 (port Vite par défaut)

### Environnement
- L'image utilise Nginx optimisé pour servir l'application
- Compression gzip activée
- Headers de sécurité configurés
- Cache optimisé pour les assets

## 🏗️ Architecture

### Image Multi-Stage
1. **Build Stage** : Node.js pour compiler l'application
2. **Production Stage** : Nginx Alpine pour servir les fichiers

### Optimisations
- Image finale ~25MB
- Temps de build ~30s
- Démarrage instantané
- Consommation mémoire minimale

## 🔍 Debugging

### Logs
```bash
# Voir les logs en temps réel
make logs

# Ou avec docker
docker logs -f snake-2025
```

### Shell Access
```bash
# Accéder au conteneur
make shell

# Ou avec docker
docker exec -it snake-2025 /bin/sh
```

### Health Check
```bash
# Vérifier la santé du conteneur
curl http://localhost:8080/health
```

## 🚢 Déploiement

### Build pour Production
```bash
# Construire avec tag de version
docker build -t snake-2025:1.0.0 .

# Tag pour registry
docker tag snake-2025:1.0.0 your-registry.com/snake-2025:1.0.0

# Push
docker push your-registry.com/snake-2025:1.0.0
```

### Docker Swarm
```bash
# Déployer en tant que service
docker service create \
  --name snake-game \
  --replicas 3 \
  --publish 80:80 \
  snake-2025:latest
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: snake-2025
spec:
  replicas: 3
  selector:
    matchLabels:
      app: snake-2025
  template:
    metadata:
      labels:
        app: snake-2025
    spec:
      containers:
      - name: snake-2025
        image: snake-2025:latest
        ports:
        - containerPort: 80
```

## 🛡️ Sécurité

### Headers de Sécurité
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Content-Security-Policy
- Referrer-Policy

### Best Practices
- Utilisation d'Alpine Linux (minimal)
- User non-root dans le conteneur
- Pas de packages inutiles
- Scan régulier des vulnérabilités

## 📊 Monitoring

### Statistiques
```bash
# Voir l'utilisation des ressources
make stats

# Ou avec docker
docker stats snake-2025
```

### Métriques
- CPU : ~0.1%
- RAM : ~5MB
- Taille image : ~25MB

## 🆘 Troubleshooting

### Le conteneur ne démarre pas
```bash
# Vérifier les logs
docker logs snake-2025

# Vérifier l'état
docker ps -a
```

### Port déjà utilisé
```bash
# Changer le port dans docker-compose.yml
ports:
  - "8081:80"  # Utiliser 8081 au lieu de 8080
```

### Problèmes de build
```bash
# Nettoyer et reconstruire
make clean
make build
```

## 📝 Notes

- L'application est optimisée pour une utilisation en conteneur
- Les données de jeu (high scores) sont stockées dans le localStorage du navigateur
- Aucune persistance côté serveur nécessaire
- Compatible avec tous les orchestrateurs (Kubernetes, Swarm, etc.)
