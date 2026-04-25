class Jumpscare {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        
        this.background = new Image();
    }

    init() {
        this.background.src = "./assets/goodJumpscareBG.png";
        this.background.onload = () => {
            this.ctx.drawImage(this.background, 0, 0);
        }
    }
}