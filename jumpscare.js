class Jumpscare {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");

        this.background = new Image();
    }

    init() {
        const num = Math.floor(random(1, 3));
        if (num === 1) {
            this.background.src = "./assets/goodJumpscareBG.png";
        } else {
            this.background.src = "./assets/badJumpscareBG.png";
        }

        this.background.onload = () => {
            this.ctx.drawImage(this.background, 0, 0);
        }
    }
}