# Variables
DOCKER_IMAGE_NAME = snake-2025
DOCKER_CONTAINER_NAME = snake-2025
PORT = 8080

# Couleurs pour l'output
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m # No Color

.PHONY: help build run stop clean dev logs shell push

# Aide par défaut
help:
	@echo "$(GREEN)Snake 2025 - Docker Commands$(NC)"
	@echo "================================"
	@echo "$(YELLOW)Production:$(NC)"
	@echo "  make build    - Construire l'image Docker"
	@echo "  make run      - Lancer le conteneur en production"
	@echo "  make stop     - Arrêter le conteneur"
	@echo "  make clean    - Nettoyer les conteneurs et images"
	@echo ""
	@echo "$(YELLOW)Development:$(NC)"
	@echo "  make dev      - Lancer en mode développement"
	@echo "  make logs     - Voir les logs du conteneur"
	@echo "  make shell    - Accéder au shell du conteneur"
	@echo ""
	@echo "$(YELLOW)Docker Compose:$(NC)"
	@echo "  make up       - Lancer avec docker-compose"
	@echo "  make down     - Arrêter docker-compose"
	@echo "  make restart  - Redémarrer les services"

# Construction de l'image Docker
build:
	@echo "$(YELLOW)Construction de l'image Docker...$(NC)"
	docker build -t $(DOCKER_IMAGE_NAME):latest .
	@echo "$(GREEN)✓ Image construite avec succès!$(NC)"

# Lancer le conteneur en production
run:
	@echo "$(YELLOW)Lancement du conteneur...$(NC)"
	docker run -d \
		--name $(DOCKER_CONTAINER_NAME) \
		-p $(PORT):80 \
		--restart unless-stopped \
		$(DOCKER_IMAGE_NAME):latest
	@echo "$(GREEN)✓ Conteneur lancé sur http://localhost:$(PORT)$(NC)"

# Arrêter le conteneur
stop:
	@echo "$(YELLOW)Arrêt du conteneur...$(NC)"
	docker stop $(DOCKER_CONTAINER_NAME) || true
	docker rm $(DOCKER_CONTAINER_NAME) || true
	@echo "$(GREEN)✓ Conteneur arrêté$(NC)"

# Nettoyer les conteneurs et images
clean: stop
	@echo "$(YELLOW)Nettoyage...$(NC)"
	docker rmi $(DOCKER_IMAGE_NAME):latest || true
	@echo "$(GREEN)✓ Nettoyage terminé$(NC)"

# Mode développement
dev:
	@echo "$(YELLOW)Lancement en mode développement...$(NC)"
	docker-compose -f docker-compose.dev.yml up
	@echo "$(GREEN)✓ Mode développement arrêté$(NC)"

# Voir les logs
logs:
	docker logs -f $(DOCKER_CONTAINER_NAME)

# Accéder au shell
shell:
	docker exec -it $(DOCKER_CONTAINER_NAME) /bin/sh

# Docker Compose - Production
up:
	@echo "$(YELLOW)Lancement avec docker-compose...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Services lancés sur http://localhost:$(PORT)$(NC)"

down:
	@echo "$(YELLOW)Arrêt des services...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Services arrêtés$(NC)"

restart:
	@echo "$(YELLOW)Redémarrage des services...$(NC)"
	docker-compose restart
	@echo "$(GREEN)✓ Services redémarrés$(NC)"

# Construction et lancement rapide
quick: build run

# Vérifier l'état
status:
	@echo "$(YELLOW)État des conteneurs:$(NC)"
	@docker ps -a | grep $(DOCKER_CONTAINER_NAME) || echo "$(RED)Aucun conteneur trouvé$(NC)"

# Statistiques du conteneur
stats:
	docker stats $(DOCKER_CONTAINER_NAME)

# Push vers un registry (à configurer)
push:
	@echo "$(YELLOW)Push de l'image vers le registry...$(NC)"
	docker tag $(DOCKER_IMAGE_NAME):latest your-registry/$(DOCKER_IMAGE_NAME):latest
	docker push your-registry/$(DOCKER_IMAGE_NAME):latest
	@echo "$(GREEN)✓ Image pushée$(NC)"
