export class Effects {
  constructor() {
    this.audioContext = null
    this.oscillator = null
  }

  init() {
    // Initialiser le contexte audio au premier clic
    document.addEventListener('click', () => {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      }
    }, { once: true })

    // Ajouter des particules au fond
    this.createBackgroundParticles()
  }

  createBackgroundParticles() {
    const particlesContainer = document.createElement('div')
    particlesContainer.className = 'particles-container'
    particlesContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    `

    document.body.appendChild(particlesContainer)

    // Créer des particules
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(0, 255, 255, 0.5);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${10 + Math.random() * 20}s linear infinite;
        animation-delay: ${Math.random() * 10}s;
      `

      particlesContainer.appendChild(particle)
    }

    // Ajouter l'animation CSS
    const style = document.createElement('style')
    style.textContent = `
      @keyframes float {
        0% {
          transform: translateY(100vh) translateX(0);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }

  playSound(frequency, duration) {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  playScoreEffect() {
    // Son de score
    this.playSound(800, 0.1)

    // Effet visuel sur le score
    const scoreElement = document.getElementById('score')
    if (scoreElement) {
      scoreElement.style.textShadow = '0 0 30px #ffff00'
      setTimeout(() => {
        scoreElement.style.textShadow = '0 0 10px currentColor'
      }, 300)
    }
  }

  playEatEffect(x, y) {
    // Son de nourriture mangée
    this.playSound(600, 0.05)
    setTimeout(() => this.playSound(800, 0.05), 50)
    setTimeout(() => this.playSound(1000, 0.05), 100)

    // Explosion de particules
    if (x !== undefined && y !== undefined) {
      const canvas = document.getElementById('game-canvas')
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        const screenX = rect.left + x
        const screenY = rect.top + y
        this.createExplosion(screenX, screenY, '#ff00ff') // Couleur magenta pour la nourriture
      }
    }

    // Flash sur le canvas
    const canvas = document.getElementById('game-canvas')
    if (canvas) {
      canvas.style.boxShadow = '0 0 50px rgba(255, 0, 255, 0.8)'
      setTimeout(() => {
        canvas.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.5)'
      }, 200)
    }
  }

  playGameOverEffect() {
    // Son de game over
    this.playSound(300, 0.2)
    setTimeout(() => this.playSound(250, 0.2), 200)
    setTimeout(() => this.playSound(200, 0.3), 400)

    // Effet de shake
    const gameContainer = document.querySelector('.game-container')
    if (gameContainer) {
      gameContainer.style.animation = 'shake 0.5s'
      setTimeout(() => {
        gameContainer.style.animation = ''
      }, 500)
    }

    // Ajouter l'animation shake
    if (!document.querySelector('#shake-animation')) {
      const style = document.createElement('style')
      style.id = 'shake-animation'
      style.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `
      document.head.appendChild(style)
    }
  }

  createExplosion(x, y, color = '#00ffff') {
    const explosion = document.createElement('div')
    explosion.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 100px;
      height: 100px;
      pointer-events: none;
      z-index: 1000;
      transform: translate(-50%, -50%); /* Centrer l'explosion */
    `

    // Créer des particules d'explosion
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div')
      const angle = (i / 12) * Math.PI * 2
      const velocity = 50 + Math.random() * 50

      particle.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        width: 6px; /* Un peu plus gros */
        height: 6px;
        background: ${color};
        box-shadow: 0 0 10px ${color};
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: explode 0.6s ease-out forwards;
      `

      particle.style.setProperty('--dx', `${Math.cos(angle) * velocity}px`)
      particle.style.setProperty('--dy', `${Math.sin(angle) * velocity}px`)

      explosion.appendChild(particle)
    }

    document.body.appendChild(explosion)

    // Ajouter l'animation
    if (!document.querySelector('#explode-animation')) {
      const style = document.createElement('style')
      style.id = 'explode-animation'
      style.textContent = `
        @keyframes explode {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0);
            opacity: 0;
          }
        }
      `
      document.head.appendChild(style)
    }

    // Retirer après l'animation
    setTimeout(() => {
      explosion.remove()
    }, 600)
  }
}
