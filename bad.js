class Bad {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        
        this.background = new Image();

        this.overlay = null;
        this.clickCount = 0;
        this.targetClicks = 50;
        this.startTime = null;
    }

    init() {
        this.background.src = "./assets/badDreamBG.png";
        this.background.onload = () => {
            this.ctx.drawImage(this.background, 0, 0);
            setTimeout(() => this.startClickGame(), 400);
        };
        this.background.onerror = () => {
            this.ctx.fillStyle = "yellow";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            setTimeout(() => this.startClickGame(), 400);
        };
    }

    startClickGame() {
        this.overlay = document.createElement("div");
        this.overlay.id = "bad-dream-overlay";

        Object.assign(this.overlay.style, {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "10",
            overflow: "hidden"
        });

        const button = document.createElement("button");
        this.button.Image = "./assets/button.png";
        Object.assign(this.button.style, {
            position: "absolute",
            width: "120px",
            height: "120px",
            cursor: "pointer",
        });

        this.button.addEventListener("click", () => this.handleClick());

        this.overlay.appendChild(button);
        this.element.appendChild(this.overlay);
    }

        handleClick() {
            this.clickCount ++;

            if (this.clickCount >= this.targetClicks) {
                this.onWin();
            }
        }

        onWin() {
            setTimeout(() => this.returnToWorld(), 2200);
        }

        returnToWorld() {
            if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            world = new World({ element: this.element });
            world.init();
        }

    }