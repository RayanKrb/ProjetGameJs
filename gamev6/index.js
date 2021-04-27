
const canvas = document.querySelector("canvas")
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

const scoreEl = document.querySelector('#scoreEl')
const startGameBtn = document.querySelector('#startGameBtn')
const modalEl = document.querySelector('#modalEl')
const bigScoreEl = document.querySelector('#bigScoreEl')
var bgsound = document.getElementById("audio")
var gameover = document.getElementById("gameover")
var explosion = document.getElementById("explosion")

//let jambon = function(){document.getElementById("explosion").play()}

class Player {
    constructor(x, y, radius, color) {
        this.x = x 
        this.y = y 
        this.radius = radius 
        this.color = color 
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false) 
        c.fillStyle = this.color  
        c.fill() 
        const img = document.getElementById("sprite")
        c.drawImage(img, this.x-55, this.y-55, 100, 100)
    }

}


class Projectile {
    constructor(x, y, radius, color, velocity) { 
        this.x = x 
        this.y = y 
        this.radius = radius 
        this.color = color 
        this.velocity = velocity 
    }
    
    draw() {
        const size = this.radius*3
        const resize = this.radius*(8/5)
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false) 
        c.fillStyle = this.color  
        c.fill()
        const img = document.getElementById("fb")
        c.drawImage(img, this.x-resize, this.y-resize, size, size)
    }

    update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }

}

class Enemy {
    constructor(x, y, radius, color, velocity) { 
        this.x = x 
        this.y = y 
        this.radius = radius 
        this.color = color 
        this.velocity = velocity
    }
    
    draw() {
        const size = this.radius * (10/3)
        const resize = this.radius * (55/30)
      
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false) 
        c.fillStyle = this.color  
        c.fill()
        const img = document.getElementById("ball")
        c.drawImage(img, this.x-resize, this.y-resize, size, size)
    }

    update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }

}

class Bonus {
    constructor(x, y, radius, color, velocity) { 
        this.x = x 
        this.y = y 
        this.radius = radius 
        this.color = color 
        this.velocity = velocity
    }
    
    draw() {
        
        const size = this.radius * (10/3)
        const resize = this.radius * (55/30)
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false) 
        c.fillStyle = this.color  
        c.fill()
        const img = document.getElementById("mariostar")
        c.drawImage(img, this.x-resize, this.y-resize, size, size)
       
    }

    update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }

}

const friction = 0.99
class Particle {
    constructor(x, y, radius, color, velocity) { 
        this.x = x 
        this.y = y 
        this.radius = radius 
        this.color = color 
        this.velocity = velocity
        this.alpha = 1
    }
    
    draw() {
        const size = this.radius * (10/3)
        const resize = this.radius * (55/30)
        
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false) 
        c.fillStyle = this.color  
        c.fill()
        const img = document.getElementById("ball")
        c.drawImage(img, this.x-resize, this.y-resize, size, size)
        c.restore()
    }

    update(){
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.01
    }

}

const x = canvas.width /2
const y = canvas.height /2 

let player = new Player(x, y, 30, '#2A5600') 
let enemies = []
let projectiles = []
let particles = []
let bonus = []

function init(){
    player = new Player(x, y, 30, '#2A5600') 
    enemies = []
    projectiles = []
    particles = []
    bonus = []
    score = 0
    scoreEl.innerHTML = score
    bigScoreEl.innerHTML = score
}

addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2, 
        event.clientX - canvas.width / 2
    )
    const velocity = {
        x: Math.cos(angle) * 4,
        y: Math.sin(angle) * 4
    }
    if(star.paused){
        projectiles.push(
            new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', velocity)
              
          )

    }else{
        projectiles.push(
            new Projectile(canvas.width / 2, canvas.height / 2, 10, 'red', velocity)
              
          )
          


    }
    
})

let animationId
let score = 0

function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.draw()
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index,1)
        }else {
            particle.update()
        }    
    })
    projectiles.forEach((projectile,index) => {
        projectile.update()
        projectile.draw()


        if (
            projectile.x + projectile.raidus < 0 || projectile.x - projectile.radius > canvas.width 
            || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height
            ) {

                setTimeout(() =>{
                    projectiles.splice(index, 1)
                },0)
                
        }
    })
    bonus.forEach((bonus1, index) =>{
        bonus1.update()

        projectiles.forEach((projectile,projectileIndex) => {

            const dist = Math.hypot(projectile.x - bonus1.x, projectile.y - bonus1.y)
            
            if (dist - bonus1.radius - projectile.radius < 1) {
                if(star.played){
                    star.currentTime = 0
                    star.pause()
                    star.volume = 0.12
                    star.play()
                }
                setTimeout(() =>{
                    bonus.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)
                },0)
            }

    
    })
})
    enemies.forEach((enemy, index) =>{
        enemy.update()
        

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            bgsound.currentTime = 0
            bgsound.pause()
            star.currentTime = 0
            star.pause()
            gameover.volume = 0.2
            gameover.play()
            modalEl.style.display = 'flex'
            bigScoreEl.innerHTML = score
        }

        projectiles.forEach((projectile,projectileIndex) => {

            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            
            if (dist - enemy.radius - projectile.radius < 1) {
                if(explosion.played){
                    explosion.currentTime = 0
                    explosion.pause()
                    explosion.volume = 0.2
                    explosion.play()
                }
              

                for (let i = 0; i < enemy.radius * 2 ; i++) {
                    particles.push(
                        new Particle(
                            projectile.x,
                            projectile.y,
                            Math.random() * 2,
                            enemy.color, 
                        {
                        x: (Math.random() - 0.5) * (Math.random() * 8),
                        y: (Math.random() - 0.5) * (Math.random() * 8)
                        })
                    )
                    
                }

                if (enemy.radius - 10 > 10) {

                    score += 100
                    scoreEl.innerHTML = score

                    enemy.radius -= 10
                    setTimeout(() =>{
                        projectiles.splice(projectileIndex, 1)
                    },0)
                }else{

                    score += 250
                    scoreEl.innerHTML = score

                    setTimeout(() =>{
                    enemies.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)
                },0)
                }
            }
        })
    })
}


function SpawnEnemies() {
    setInterval(() =>{
        const radius = Math.random()*(30 - 4) + 4
        
        let x   
        let y

        if (Math.random()< 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        } 
        
        const color = 'green'

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
        if(score>10000>19999){
            const velocity = {
                x : Math.cos(angle)*1.2,
                y : Math.sin(angle)*1.2
            }
            enemies.push(new Enemy(x,y,radius,color, velocity))
            
        }else if(score>20000>29999){
            const velocity = {
                x : Math.cos(angle)*1.4,
                y : Math.sin(angle)*1.4
            }
            enemies.push(new Enemy(x,y,radius,color, velocity))
            
        }else if(score>30000>39999){
            const velocity = {
                x : Math.cos(angle)*1.8,
                y : Math.sin(angle)*1.8
            }
            enemies.push(new Enemy(x,y,radius,color, velocity))
            
        }else if(score>40000>49999){
            const velocity = {
                x : Math.cos(angle)*2,
                y : Math.sin(angle)*2
            }
            enemies.push(new Enemy(x,y,radius,color, velocity))
            
        }else if(score>50000){
            const velocity = {
                x : Math.cos(angle)*2.5,
                y : Math.sin(angle)*2.5
            }
            enemies.push(new Enemy(x,y,radius,color, velocity))
            
        }else{
            const velocity = {
                x : Math.cos(angle),
                y : Math.sin(angle)
            }

            enemies.push(new Enemy(x,y,radius,color, velocity))
        }
       
        
        
    },1200)
}

function SpawnBonus() {
    setInterval(() =>{
        const radius = Math.random()*(15 - 4) + 4
        
        let x
        let y

        if (Math.random()< 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        } 
        
        const color = 'blue'

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
        
        const velocity = {
            x : Math.cos(angle)*2.5,
            y : 0.5
        }
        
        bonus.push(new Bonus(x,y,radius,color, velocity))
        
    },15000)
}

startGameBtn.addEventListener('click', () => {
    bgsound.volume = 0.03
    bgsound.play()

    init()
    animate()
    SpawnEnemies()
    SpawnBonus()
    modalEl.style.display = 'none'
})