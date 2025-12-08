export class Game {
  constructor(canvas, speed = 100) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.gridSize = 20
    this.tileCount = this.canvas.width / this.gridSize
    
    // État du jeu
    this.snake = []
    this.direction = { x: 1, y: 0 }
    this.nextDirection = { x: 1, y: 0 }
    this.food = {}
    this.score = 0
    this.speed = speed
    this.isRunning = false
    this.isPaused = false
    this.gameLoop = null
    
    // Callbacks
    this.onScoreUpdate = null
    this.onGameOver = null
    this.onFoodEaten = null
    
    // Couleurs néon
    this.colors = {
      snake: '#00ffff',
      snakeGlow: 'rgba(0, 255, 255, 0.5)',
      food: '#ff00ff',
      foodGlow: 'rgba(255, 0, 255, 0.5)',
      grid: 'rgba(0, 255, 255, 0.1)'
    }
    
    this.init()
  }

  init() {
    // Initialiser le serpent au centre
    const centerX = Math.floor(this.tileCount / 2)
    const centerY = Math.floor(this.tileCount / 2)
    
    this.snake = [
      { x: centerX - 2, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX, y: centerY }
    ]
    
    // Placer la première nourriture
    this.placeFood()
  }

  start() {
    this.isRunning = true
    this.isPaused = false
    this.gameLoop = setInterval(() => this.update(), this.speed)
  }

  pause() {
    this.isPaused = true
    clearInterval(this.gameLoop)
  }

  resume() {
    this.isPaused = false
    this.gameLoop = setInterval(() => this.update(), this.speed)
  }

  stop() {
    this.isRunning = false
    this.isPaused = false
    clearInterval(this.gameLoop)
  }

  update() {
    if (!this.isRunning || this.isPaused) return
    
    // Mettre à jour la direction
    this.direction = { ...this.nextDirection }
    
    // Calculer la nouvelle position de la tête
    const head = { ...this.snake[this.snake.length - 1] }
    head.x += this.direction.x
    head.y += this.direction.y
    
    // Vérifier les collisions avec les murs
    if (head.x < 0 || head.x >= this.tileCount || 
        head.y < 0 || head.y >= this.tileCount) {
      this.gameOver()
      return
    }
    
    // Vérifier les collisions avec le corps
    for (let segment of this.snake) {
      if (head.x === segment.x && head.y === segment.y) {
        this.gameOver()
        return
      }
    }
    
    // Ajouter la nouvelle tête
    this.snake.push(head)
    
    // Vérifier si on mange la nourriture
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10
      if (this.onScoreUpdate) this.onScoreUpdate(this.score)
      if (this.onFoodEaten) this.onFoodEaten()
      this.placeFood()
    } else {
      // Retirer la queue si on ne mange pas
      this.snake.shift()
    }
    
    // Redessiner
    this.draw()
  }

  draw() {
    // Effacer le canvas
    this.ctx.fillStyle = '#0a0a0f'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Dessiner la grille (optionnel, déjà en CSS)
    this.drawGrid()
    
    // Dessiner la nourriture
    this.drawFood()
    
    // Dessiner le serpent
    this.drawSnake()
  }

  drawGrid() {
    this.ctx.strokeStyle = this.colors.grid
    this.ctx.lineWidth = 0.5
    
    for (let i = 0; i <= this.tileCount; i++) {
      const pos = i * this.gridSize
      
      // Lignes verticales
      this.ctx.beginPath()
      this.ctx.moveTo(pos, 0)
      this.ctx.lineTo(pos, this.canvas.height)
      this.ctx.stroke()
      
      // Lignes horizontales
      this.ctx.beginPath()
      this.ctx.moveTo(0, pos)
      this.ctx.lineTo(this.canvas.width, pos)
      this.ctx.stroke()
    }
  }

  drawSnake() {
    this.snake.forEach((segment, index) => {
      const x = segment.x * this.gridSize
      const y = segment.y * this.gridSize
      const size = this.gridSize - 2
      
      // Effet de glow
      this.ctx.shadowColor = this.colors.snakeGlow
      this.ctx.shadowBlur = 10
      
      // Corps du serpent avec gradient
      const gradient = this.ctx.createLinearGradient(x, y, x + size, y + size)
      gradient.addColorStop(0, this.colors.snake)
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0.7)')
      
      this.ctx.fillStyle = gradient
      this.ctx.fillRect(x + 1, y + 1, size, size)
      
      // Bordure néon
      this.ctx.strokeStyle = this.colors.snake
      this.ctx.lineWidth = 2
      this.ctx.strokeRect(x + 1, y + 1, size, size)
      
      // Tête du serpent (dernier segment)
      if (index === this.snake.length - 1) {
        this.ctx.shadowBlur = 20
        this.ctx.fillStyle = '#ffffff'
        const eyeSize = 4
        
        // Position des yeux selon la direction
        if (this.direction.x === 1) { // Droite
          this.ctx.fillRect(x + size - 6, y + 4, eyeSize, eyeSize)
          this.ctx.fillRect(x + size - 6, y + size - 8, eyeSize, eyeSize)
        } else if (this.direction.x === -1) { // Gauche
          this.ctx.fillRect(x + 2, y + 4, eyeSize, eyeSize)
          this.ctx.fillRect(x + 2, y + size - 8, eyeSize, eyeSize)
        } else if (this.direction.y === -1) { // Haut
          this.ctx.fillRect(x + 4, y + 2, eyeSize, eyeSize)
          this.ctx.fillRect(x + size - 8, y + 2, eyeSize, eyeSize)
        } else { // Bas
          this.ctx.fillRect(x + 4, y + size - 6, eyeSize, eyeSize)
          this.ctx.fillRect(x + size - 8, y + size - 6, eyeSize, eyeSize)
        }
      }
      
      this.ctx.shadowBlur = 0
    })
  }

  drawFood() {
    const x = this.food.x * this.gridSize
    const y = this.food.y * this.gridSize
    const size = this.gridSize - 2
    
    // Animation de pulsation
    const pulse = Math.sin(Date.now() * 0.005) * 0.2 + 0.8
    
    // Effet de glow
    this.ctx.shadowColor = this.colors.foodGlow
    this.ctx.shadowBlur = 20 * pulse
    
    // Dessiner la nourriture
    this.ctx.fillStyle = this.colors.food
    this.ctx.beginPath()
    this.ctx.arc(x + this.gridSize / 2, y + this.gridSize / 2, (size / 2) * pulse, 0, Math.PI * 2)
    this.ctx.fill()
    
    // Bordure néon
    this.ctx.strokeStyle = this.colors.food
    this.ctx.lineWidth = 2
    this.ctx.stroke()
    
    // Centre lumineux
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    this.ctx.beginPath()
    this.ctx.arc(x + this.gridSize / 2, y + this.gridSize / 2, 3, 0, Math.PI * 2)
    this.ctx.fill()
    
    this.ctx.shadowBlur = 0
  }

  placeFood() {
    do {
      this.food = {
        x: Math.floor(Math.random() * this.tileCount),
        y: Math.floor(Math.random() * this.tileCount)
      }
    } while (this.snake.some(segment => 
      segment.x === this.food.x && segment.y === this.food.y
    ))
  }

  changeDirection(newDirection) {
    // Empêcher de faire demi-tour
    if (this.direction.x === -newDirection.x && this.direction.y === -newDirection.y) {
      return
    }
    
    this.nextDirection = newDirection
  }

  gameOver() {
    this.stop()
    if (this.onGameOver) this.onGameOver()
  }
}
