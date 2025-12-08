export class Controls {
  constructor(game) {
    this.game = game
    this.touchStartX = 0
    this.touchStartY = 0
    this.minSwipeDistance = 30
    
    this.init()
  }

  init() {
    // Contrôles clavier
    this.setupKeyboardControls()
    
    // Contrôles tactiles
    this.setupTouchControls()
    
    // Boutons tactiles
    this.setupTouchButtons()
  }

  setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      if (!this.game.isRunning || this.game.isPaused) return
      
      switch(e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          e.preventDefault()
          this.game.changeDirection({ x: 0, y: -1 })
          break
        case 'arrowdown':
        case 's':
          e.preventDefault()
          this.game.changeDirection({ x: 0, y: 1 })
          break
        case 'arrowleft':
        case 'a':
          e.preventDefault()
          this.game.changeDirection({ x: -1, y: 0 })
          break
        case 'arrowright':
        case 'd':
          e.preventDefault()
          this.game.changeDirection({ x: 1, y: 0 })
          break
      }
    })
  }

  setupTouchControls() {
    const canvas = this.game.canvas
    
    // Touch start
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      this.touchStartX = touch.clientX
      this.touchStartY = touch.clientY
    }, { passive: false })
    
    // Touch end
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault()
      if (!this.game.isRunning || this.game.isPaused) return
      
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - this.touchStartX
      const deltaY = touch.clientY - this.touchStartY
      
      // Déterminer la direction du swipe
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Mouvement horizontal
        if (Math.abs(deltaX) > this.minSwipeDistance) {
          if (deltaX > 0) {
            this.game.changeDirection({ x: 1, y: 0 }) // Droite
          } else {
            this.game.changeDirection({ x: -1, y: 0 }) // Gauche
          }
        }
      } else {
        // Mouvement vertical
        if (Math.abs(deltaY) > this.minSwipeDistance) {
          if (deltaY > 0) {
            this.game.changeDirection({ x: 0, y: 1 }) // Bas
          } else {
            this.game.changeDirection({ x: 0, y: -1 }) // Haut
          }
        }
      }
    }, { passive: false })
    
    // Empêcher le scroll sur mobile
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault()
    }, { passive: false })
  }

  setupTouchButtons() {
    const touchButtons = document.querySelectorAll('.touch-btn')
    
    touchButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!this.game.isRunning || this.game.isPaused) return
        
        const direction = e.target.dataset.direction
        
        switch(direction) {
          case 'up':
            this.game.changeDirection({ x: 0, y: -1 })
            break
          case 'down':
            this.game.changeDirection({ x: 0, y: 1 })
            break
          case 'left':
            this.game.changeDirection({ x: -1, y: 0 })
            break
          case 'right':
            this.game.changeDirection({ x: 1, y: 0 })
            break
        }
        
        // Effet visuel
        e.target.style.transform = 'scale(0.95)'
        setTimeout(() => {
          e.target.style.transform = 'scale(1)'
        }, 100)
      })
    })
  }
}
