import './style.css'
import { Game } from './js/game.js'
import { UI } from './js/ui.js'
import { Controls } from './js/controls.js'
import { Effects } from './js/effects.js'

// Initialisation de l'application
class SnakeApp {
  constructor() {
    this.game = null
    this.ui = new UI()
    this.controls = null
    this.effects = new Effects()
    this.gameSpeed = 100

    this.init()
  }

  init() {
    // Charger le high score
    this.ui.updateHighScore(this.getHighScore())

    // Event listeners
    this.setupEventListeners()

    // Ajouter les effets visuels
    this.effects.init()
  }

  setupEventListeners() {
    // Bouton jouer
    document.getElementById('play-btn').addEventListener('click', () => {
      this.startGame()
    })

    // Sélection de difficulté
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'))
        e.target.classList.add('active')
        this.gameSpeed = parseInt(e.target.dataset.speed)
      })
    })

    // Boutons de pause
    document.getElementById('pause-btn').addEventListener('click', () => {
      this.pauseGame()
    })

    document.getElementById('resume-btn').addEventListener('click', () => {
      this.resumeGame()
    })

    // Boutons game over
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.restartGame()
    })

    document.getElementById('home-btn').addEventListener('click', () => {
      this.goToHome()
    })

    document.getElementById('quit-btn').addEventListener('click', () => {
      this.goToHome()
    })
  }

  startGame() {
    // Transition vers l'écran de jeu
    this.ui.showScreen('game-screen')

    // Créer le canvas
    const canvas = document.getElementById('game-canvas')
    const container = document.querySelector('.game-container')

    // Ajuster la taille du canvas
    let size = Math.min(window.innerWidth - 40, window.innerHeight - 200, 600)
    // S'assurer que la taille est un multiple de la grille (20px)
    size = Math.floor(size / 20) * 20

    canvas.width = size
    canvas.height = size

    // Initialiser le jeu
    this.game = new Game(canvas, this.gameSpeed)
    this.controls = new Controls(this.game)

    // Callbacks
    this.game.onScoreUpdate = (score) => {
      this.ui.updateScore(score)
      this.effects.playScoreEffect()
    }

    this.game.onGameOver = () => {
      this.handleGameOver()
    }

    this.game.onFoodEaten = () => {
      this.effects.playEatEffect()
    }

    // Démarrer le jeu
    this.game.start()
  }

  pauseGame() {
    if (this.game && this.game.isRunning && !this.game.isPaused) {
      this.game.pause()
      this.ui.showOverlay('pause-screen')
    }
  }

  resumeGame() {
    if (this.game && this.game.isPaused) {
      this.ui.hideOverlay('pause-screen')
      this.game.resume()
    }
  }

  restartGame() {
    this.ui.hideOverlay('gameover-screen')
    this.startGame()
  }

  goToHome() {
    if (this.game) {
      this.game.stop()
    }
    this.ui.hideOverlay('pause-screen')
    this.ui.hideOverlay('gameover-screen')
    this.ui.showScreen('home-screen')
    this.ui.updateScore(0)
  }

  handleGameOver() {
    const score = this.game.score
    const highScore = this.getHighScore()

    // Mettre à jour le score final
    document.getElementById('final-score').textContent = score

    // Vérifier si c'est un nouveau record
    if (score > highScore) {
      this.setHighScore(score)
      this.ui.updateHighScore(score)
      document.getElementById('new-record').classList.add('show')
    } else {
      document.getElementById('new-record').classList.remove('show')
    }

    // Afficher l'écran game over
    this.ui.showOverlay('gameover-screen')
    this.effects.playGameOverEffect()
  }

  getHighScore() {
    return parseInt(localStorage.getItem('snake-highscore') || '0')
  }

  setHighScore(score) {
    localStorage.setItem('snake-highscore', score.toString())
  }
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', () => {
  new SnakeApp()
})
