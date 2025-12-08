# 🎮 NEON SNAKE 2025 - Cyberpunk Edition

Un jeu Snake futuriste avec une esthétique cyberpunk, développé avec les technologies web modernes et containerisé avec Docker.

## 🚀 Caractéristiques

- 🎨 Design cyberpunk avec effets néon
- 📱 Responsive (desktop et mobile)
- 🎯 3 niveaux de difficulté
- 💾 Sauvegarde du meilleur score
- 🎵 Effets sonores immersifs
- 🐳 Containerisé avec Docker

## 🛠️ Technologies

- HTML5 Canvas
- CSS3 (animations, effets néon)
- JavaScript ES6+
- Vite (build tool)
- Docker & Docker Compose
- Nginx (serveur web)

## 📦 Installation

### Méthode 1: Docker (Recommandé)

```bash
# Cloner le repository
git clone https://github.com/votre-username/neon-snake-2025.git
cd neon-snake-2025

# Lancer en production
make run

# Ou avec docker-compose directement
docker-compose up -d
```

Le jeu sera accessible sur http://localhost:8080

### Méthode 2: Installation locale

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour la production
npm run build
```

## 🐳 Utilisation Docker

### Commandes disponibles

```bash
# Construire l'image
make build

# Lancer en production
make run

# Lancer en développement
make dev

# Voir les logs
make logs

# Arrêter
make stop

# Nettoyer
make clean
```

### Docker Compose

```bash
# Lancer en production
docker-compose up -d

# Lancer en développement
docker-compose -f docker-compose.dev.yml up

# Arrêter
docker-compose down
```

## 🎮 Comment jouer

### Contrôles

- **Clavier**: Flèches directionnelles ou WASD
- **Mobile**: Boutons tactiles à l'écran
- **Pause**: Espace ou bouton pause

### Objectif

- Mangez la nourriture pour grandir
- Évitez les murs et votre propre corps
- Atteignez le score le plus élevé possible!

### Niveaux de difficulté

- **EASY**: Vitesse lente (200ms)
- **NORMAL**: Vitesse standard (100ms)
- **HARD**: Vitesse rapide (70ms)

## 🏗️ Architecture

```
neon-snake-2025/
├── index.html          # Page principale
├── style.css           # Styles globaux
├── main.js             # Point d'entrée
├── js/                 # Modules JavaScript
│   ├── game.js         # Logique du jeu
│   ├── snake.js        # Classe Snake
│   ├── food.js         # Classe Food
│   ├── ui.js           # Gestion UI
│   └── audio.js        # Effets sonores
├── Dockerfile          # Image Docker
├── docker-compose.yml  # Configuration Docker
├── nginx.conf          # Configuration Nginx
└── Makefile           # Commandes utilitaires
```

## 🚀 Déploiement

### Sur un VPS avec Docker

```bash
# Sur votre serveur
git clone https://github.com/votre-username/neon-snake-2025.git
cd neon-snake-2025

# Modifier le port si nécessaire dans docker-compose.yml
# Lancer
docker-compose up -d
```

### Avec un reverse proxy (Nginx/Traefik)

Le docker-compose.yml inclut des labels Traefik. Pour Nginx, configurez un proxy_pass vers le port 8080.

## 🔧 Configuration

### Variables d'environnement

Vous pouvez personnaliser certains paramètres via les variables d'environnement dans docker-compose.yml:

```yaml
environment:
  - PORT=80
  - NODE_ENV=production
```

### Personnalisation

Pour modifier les couleurs, vitesses ou autres paramètres, éditez les fichiers correspondants:

- `style.css`: Couleurs et animations
- `main.js`: Configuration des difficultés
- `js/game.js`: Logique du jeu

## 📝 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à:

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 🐛 Bugs connus

- Aucun bug connu actuellement

## 📞 Support

Pour toute question ou problème, contactez-nous : contact@nbility.fr

---

Fait avec ❤️ et beaucoup de néons 🌟
