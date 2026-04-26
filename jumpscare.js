class Jumpscare {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        
        this.background = new Image();
        this.night = new Image();
        this.day = new Image();
        
        this.xpos = 0;
        this.ypos = 0;
        this.animationId = null;
    }

    init() {
        const num = Math.floor(random(1, 3));
        if (num === 1) {
            this.background.src = "./assets/goodJumpscareBG.png";
        } else {
            this.background.src = "./assets/badJumpscareBG.png";
        }
        
        this.background.onload = () => {
            this.drawScene();
            setTimeout(() => {
                this.returnToWorld();
            }, 3000);
        }
    }

    drawScene() {
        const shakeX = (Math.random() - 0.5) * 16;
        const shakeY = (Math.random() - 0.5) * 16;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.drawImage(this.background, shakeX, shakeY, this.canvas.width, this.canvas.height);
        
        this.animationId = requestAnimationFrame(() => this.drawScene());

    }

    returnToWorld() {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        world = new World({ element: this.element });
        world.init();
    }
}
