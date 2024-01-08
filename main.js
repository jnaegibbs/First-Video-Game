import './style.css';
import Phaser from 'phaser';

const sizes= {
  width: 750,
  height: 750
};

const speedDown = 150;

const gameStartDiv = document.querySelector("#gameStartDiv")
const gameStartButton = document.querySelector("#gameStartButton")
const gameEndDiv = document.querySelector("#gameEndDiv")
const gameWinLoseSpan = document.querySelector("#gameWinLoseSpan")
const gameEndScoreSpan = document.querySelector("#gameEndScoreSpan")

class GameScene extends Phaser.Scene{
  constructor(){
    super("scene-game")
    this.player
    this.cursor
    this.playerSpeed = speedDown + 50;
    this.target
    this.points = 0
    this.textScore
    this.textTime
    this.timedEvent
    this.remainingTime
    this.coinMusic
    this.bgMusic
    this.emitter

  }
  preload(){
    this.load.image("space", "/public/assets/space.png");
    this.load.image("red_alien", "public/assets/red_alien.png");
    this.load.image("ramen", "/public/assets/noodles.png");
    this.load.audio("coin", "/public/assets/coin.mp3");
    this.load.audio("RandA", "/public/assets/RandA.mp3")
    this.load.image("sparkles", "public/assets/sparkles.png")
  }

  create(){
    
    this.scene.pause("scene-game")

    this.coinMusic = this.sound.add("coin");
    this.bgMusic = this.sound.add("RandA");
    this.bgMusic.play();

    this.add.image(0,0, "space").setOrigin(0,0);
    this.player = this.physics.add.image(0, sizes.height-100, "red_alien").setOrigin(0,0).setScale(0.2);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    this.target = this.physics.add.image(0,0, "ramen").setOrigin(0,0);
    this.target.setMaxVelocity(0, speedDown);

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);

    this.cursor = this.input.keyboard.createCursorKeys();

    this.textScore = this.add.text(sizes.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      fill: "#f5f5f5",
    });
    this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
      font: "25px Arial",
      fill: "#f5f5f5",
    });

    this.timedEvent = this.time.delayedCall(30000, this.gameOver, [], this)

    this.emitter = this.add.particles(0,0,"sparkles", {
      speed: 100,
      gravityY: speedDown - 200,
      scale: 1,
      duration: 100,
      emitting: false
    })
    this.emitter.startFollow(this.player, 0, 0, true)
  }

  update(){
    this.remainingTime = this.timedEvent.getRemainingSeconds()
    this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime).toString()}`)
    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX())
    }
    const { left, right }= this.cursor;
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }
  getRandomX () {
    return Math.floor(Math.random() * 480);
  };

  targetHit() {
    console.log("target hit!")
    this.coinMusic.play()
    this.emitter.start()
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Score: ${this.points}`)
  }

  gameOver() {
    this.sys.game.destroy(true)
    if(this.points >=10) {
      gameEndScoreSpan.textContent = this.points
      gameWinLoseSpan.textContent = "Winner!"
    } else { 
      gameEndScoreSpan.textContent = this.points
      gameWinLoseSpan.textContent = "Loser."
    }
    gameEndDiv.style.display = "flex"
  }
}


const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y: speedDown},
      debug: true
    }
  },
  scene: [GameScene]
}

const game = new Phaser.Game(config);

gameStartButton.addEventListener("click", () => {
  gameStartDiv.style.display = "none"
  game.scene.resume("scene-game")
})
