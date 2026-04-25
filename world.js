class World {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    init() {
        const background = new Image();
        background.onload = () => {
            this.ctx.drawImage(background, 0, 0)
        };
        background.src = "/assets/background.png";

        const player = new Image();
        player.onload = () => {
            this.ctx.drawImage(player, 0, 0);
        }
        player.src = "/assets/player.png";

    }
}