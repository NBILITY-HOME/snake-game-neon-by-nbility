export class UI {
  constructor() {
    this.screens = {
      home: document.getElementById('home-screen'),
      game: document.getElementById('game-screen'),
      pause: document.getElementById('pause-screen'),
      gameover: document.getElementById('gameover-screen')
    }
    
    this.scoreElement = document.getElementById('score')
    this.highScoreElement = document.getElementById('high-score')
  }

  showScreen(screenId) {
    // Masquer tous les écrans
    Object.values(this.screens).forEach(screen => {
      if (screen) screen.classList.remove('active')
    })
    
    // Afficher l'écran demandé
    const screen = document.getElementById(screenId)
    if (screen) screen.classList.add('active')
  }

  showOverlay(overlayId) {
    const overlay = document.getElementById(overlayId)
    if (overlay) overlay.classList.add('active')
  }

  hideOverlay(overlayId) {
    const overlay = document.getElementById(overlayId)
    if (overlay) overlay.classList.remove('active')
  }

  updateScore(score) {
    if (this.scoreElement) {
      this.scoreElement.textContent = score
      
      // Animation du score
      this.scoreElement.style.transform = 'scale(1.2)'
      setTimeout(() => {
        this.scoreElement.style.transform = 'scale(1)'
      }, 200)
    }
  }

  updateHighScore(score) {
    if (this.highScoreElement) {
      this.highScoreElement.textContent = score
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div')
    notification.className = `notification ${type}`
    notification.textContent = message
    
    document.body.appendChild(notification)
    
    // Animation d'entrée
    setTimeout(() => {
      notification.classList.add('show')
    }, 10)
    
    // Retirer après 3 secondes
    setTimeout(() => {
      notification.classList.remove('show')
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 3000)
  }
}
