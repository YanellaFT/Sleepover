class World {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    
    this.background = new Image();
    this.player = new Image();
    this.playerPos = { x: 700, y: 350 };
    this.directionInput = null;
  }

  startGameLoop() {
    const step = () => {
        if (!this.running) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const speed = 4;
        if (this.directionInput.direction === "up") this.playerPos.y -= speed;
        if (this.directionInput.direction === "down") this.playerPos.y += speed;
        if (this.directionInput.direction === "left") this.playerPos.x -= speed;
        if (this.directionInput.direction === "right") this.playerPos.x += speed;


        // console.log(this.playerPos); //top till 266

        if (this.playerPos.y < 266) this.playerPos.y = 288
        if (this.playerPos.x > 1056) this.playerPos.x = 1056;
        if (this.playerPos.x < 0) this.playerPos.x = 0;
        if (this.playerPos.y > 680) this.playerPos.y = 680;
        
    
        this.ctx.drawImage(this.background, 0, 0);
        this.ctx.drawImage(this.player, this.playerPos.x, this.playerPos.y);

        if (!this.firefly.caught) {
            this.firefly.update();
            this.ctx.drawImage(this.firefly.image, this.firefly.position.x, this.firefly.position.y);
        }
        if (this.firefly.caught && !this.called) {
            this.dream = Math.floor(random(1, 4));
            this.called = true;
            this.running = false;
            getDream(this.dream);
        }

        requestAnimationFrame(() => {
            step();
        });
    }
    
    this.running = true;
    step();
  }

  init() {
    this.directionInput = new Directions();
    this.directionInput.init();

    this.firefly = new Firefly();

    this.background.src = "./assets/background.png";
    this.player.src = "./assets/player.png";

    this.player.onload = () => {
      this.startGameLoop();
    };
  }
}