const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d')
const enemies = []
const coins = []
let coinsCollected = [];

canvas.width = 1100;
canvas.height = 600;
let gameOver = false

class InputHandler {
  constructor() {
    this.keys = []
    window.addEventListener('keydown', e => {
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')
        && this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key)
      }
    })
    window.addEventListener('keyup', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        this.keys.splice(this.keys.indexOf(e.key), 1)
      }
    })
  }
}

class Player {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.width = 200;
    this.height = 200;
    this.x = 0;
    this.y = this.gameHeight - this.height;
    this.image = document.getElementById('playerImage')
    this.frameX = 0;
    this.frameY = 0;
    this.speed = 1;
    this.vy = 0;
    this.weight = 1;
    //for player animation
    this.maxFrame = 8;
    this.fps = 40
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;

  }
  draw(context) {
    // for rectangle or square box filled
    // context.fillStyle = 'white'
    // context.fillRect(this.x, this.y, this.width, this.height)
    // ------ *** -----
    // for rectangle or square box empty 
    // context.strokeStyle = 'white'
    // context.strokeRect(this.x, this.y, this.width, this.height)
    // ------ *** -----
    // for circle empty 
    // context.beginPath();
    // context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
    // context.stroke();
    // ------ *** -----
    // for drawing the image
    context.drawImage(
      this.image,
      this.frameX * this.width, //sourceX
      this.frameY * this.height, //sourceY
      this.width, //sourceWidth
      this.height, //sourceHeight
      this.x, //xPosition
      this.y, //yPosition
      this.width, //width
      this.height //height
    )
    // ------ *** -----
  }
  update(input, deltaTime) {
    console.log('enemy - , enemy.x, this.x, dx, dy, distance, enemy.width / 2 + this.width / 2 ')

    //collinsion detection
    enemies.forEach((enemy) => {
      let dx = enemy.x - this.x
      let dy = enemy.y - this.y
      let distance = Math.sqrt(dx * dx + dy * dy)
      console.log('enemy - ', enemy.x, this.x, dx, dy, distance, enemy.width / 2 + this.width / 2)

      if (distance + 10 < enemy.width / 2 + this.width / 2) {
        alert(`gameOver ${coinsCollected.length}`)
        gameOver = true

      }
    })

    coins.forEach((coin, idx) => {
      let dx = coin.x - this.x
      let dy = coin.y - this.y
      let distance = Math.sqrt(dx * dx + dy * dy)
      console.log('coin - ', coin.x, this.x, dx, dy, distance, coin.width / 2 + this.width / 2)
      if (distance < coin.width / 2 + this.width / 2) {
        // alert('gameOver')
        console.log({ coinsCollected })
        if (!coinsCollected.includes(idx)) coinsCollected.push(idx)
      }
    })
    // ------ *** -----

    //for sprite animation
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX >= this.maxFrame) this.frameX = 0;
      else this.frameX++;
      this.frameTimer = 0;
    }
    else {
      this.frameTimer += deltaTime
    }
    // ------ *** -----


    //for controls
    if (input.keys.indexOf('ArrowRight') > -1) {
      this.speed = 8;
    }
    else if (input.keys.indexOf('ArrowLeft') > -1) {
      this.speed = -8;
    }
    else if (input.keys.indexOf('ArrowUp') > -1) {
      this.vy -= 4;
    }
    // else if (input.keys.indexOf('ArrowDown') > -1) {
    //   this.vy = 20;
    // }
    else {
      this.speed = 0;
    }

    //horizontal movement 
    this.x += this.speed;
    if (this.x < 0) this.x = 0;
    else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width

    //vertical movement
    this.y += this.vy
    if (!this.onGround()) {
      this.vy += this.weight
      this.frameY = 1
      this.maxFrame = 5; //for sprite animation 
    }
    else {
      this.vy = 0;
      this.frameY = 0
      this.maxFrame = 8; //for sprite animation
    }
    // if (this.y < 0) this.y = 0;
    if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height
  }

  onGround() {
    return this.y >= this.gameHeight - this.height
  }
}


class Background {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth
    this.gameHeight = gameHeight
    this.image = document.getElementById('backgroundImage')
    this.x = 0;
    this.y = 0;
    this.width = 2400;
    this.height = 720;
    this.speed = 4;
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height)
    context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
  }
  update() {
    this.x -= this.speed;
    if (this.x < (0 - this.width)) this.x = 0;
  }

}

class Enemy {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth
    this.gameHeight = gameHeight
    this.width = 160;
    this.height = 119;
    this.image = document.getElementById('enemyImage')
    this.x = this.gameWidth;
    this.y = this.gameHeight - this.height;
    this.frameX = 0;
    this.maxFrame = 5;
    this.fps = 20
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
    this.speed = 4;
  }
  draw(context) {
    // for circle empty 
    // context.beginPath();
    // context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
    // context.stroke();
    // ------ *** -----
    context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)

  }
  update(deltaTime) {
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX >= this.maxFrame) this.frameX = 0;
      else this.frameX++;
    }
    else {
      this.frameTimer += deltaTime
    }
    this.x -= this.speed;
  }
}

class Coin {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth
    this.gameHeight = gameHeight
    this.width = 100;
    this.height = 90;
    this.image = document.getElementById('coinImage')
    this.x = this.gameWidth;
    this.y = this.gameHeight - this.height;
    this.frameX = 0;
    this.speed = 4;
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
  update() {
    this.x -= this.speed;
  }
}
let lastTime = 0
let enemyTimer = 0;
let randomEnemyInterval = (Math.random() * 5000) + 1000
let coinTimer = 0;
let randomcoinInterval = 1500


function handleEnemies(deltaTime) {
  if (enemyTimer > randomEnemyInterval) {
    enemies.push(new Enemy(canvas.width, canvas.height))
    randomEnemyInterval = (Math.random() * 5000) + 1000
    enemyTimer = 0;
  }
  else {
    enemyTimer += deltaTime
  }
  enemies.forEach((enemy) => {
    enemy.draw(ctx)
    enemy.update(deltaTime)
  })
}
function handleCoins(deltaTime) {
  if (coinTimer > randomcoinInterval) {
    coins.push(new Coin(canvas.width, canvas.height))
    randomcoinInterval = 1500//(Math.random() * 5000) + 1000
    coinTimer = 0;
  }
  else {
    coinTimer += deltaTime
  }
  coins.forEach((coin, idx) => {
    if (!coinsCollected.includes(idx)) coin.draw(ctx), coin.update()
  })
}

const input = new InputHandler()
const player = new Player(canvas.width, canvas.height)
const background = new Background(canvas.width, canvas.height)

// player.draw(ctx);
// update();

function animate(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.draw(ctx);
  background.update();
  handleCoins(deltaTime);
  player.draw(ctx);
  player.update(input, deltaTime);
  handleEnemies(deltaTime);
  if (!gameOver) requestAnimationFrame(animate); //this requestAnimationFrame will automatically pass timestamp to animate functio 
}


animate(0); //we have to pass something bcz requestAnimationFrame passses timestamp and our animate function want that
