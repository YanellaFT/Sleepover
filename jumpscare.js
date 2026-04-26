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
        const num = Math.floor(random(1, 2));
        if (num === 1) {
            this.background.src = "./assets/goodJumpscareBG.png";
        } else {
            this.background.src = "./assets/badJumpscareBG.png";
        }
        
        this.night.src = "./assets/night.png";
        this.day.src = "./assets/day.png";
        
        this.background.onload = () => {
            this.startAnimation();
        }
    }

    startAnimation() {
        this.drawScene();
    }

    drawScene() {
        // Draw background first
        this.ctx.drawImage(this.background, 0, 0);
        
        // Draw animated layers on top
        this.ctx.drawImage(this.night, this.xpos, 0);
        this.ctx.drawImage(this.day, 400, this.ypos);
        
        this.xpos += 1;
        this.ypos += 1;
        
        if (this.xpos > this.canvas.width) {
            this.xpos = -400;
        }
        if (this.ypos > this.canvas.height) {
            this.ypos = -400;
        }
        
        this.animationId = requestAnimationFrame(() => this.drawScene());
    }
}

