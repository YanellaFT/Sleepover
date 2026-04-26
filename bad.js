class Bad {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
 
        this.background = new Image();
        this.overlay = null;
        this.clickCount = 0;
        this.targetClicks = 50;
        this.animFrame = null;
        this.startTime = null;
        this.orbiters = [];
    }
 
    init() {
        this.background.src = "./assets/badDreamBG.png";
        this.background.onload = () => {
            this.ctx.drawImage(this.background, 0, 0);
            setTimeout(() => this.startClickGame(), 400);
        };
        this.background.onerror = () => {
            this.ctx.fillStyle = "#0a0010";
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
            zIndex: "10",
            overflow: "hidden",
        });
 
        // Button
        const button = document.createElement("img");
        button.src = "./assets/button.png";
        Object.assign(button.style, {
            position: "absolute",
            width: "400px",
            height: "400px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
            zIndex: "12",
        });
 
        button.onerror = () => {
            button.style.display = "none";
            const fallback = document.createElement("button");
            fallback.textContent = "CLICK ME";
            Object.assign(fallback.style, {
                position: "absolute",
                width: "120px",
                height: "120px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "900",
                background: "darkred",
                color: "white",
                border: "3px solid red",
                borderRadius: "12px",
                zIndex: "12",
            });
            fallback.addEventListener("click", () => this.handleClick());
            this.overlay.appendChild(fallback);
        };
 
        button.addEventListener("click", () => this.handleClick());
        this.overlay.appendChild(button);
 

 
        this.element.appendChild(this.overlay);
 
        this.startTime = performance.now();
    }
 
 
    handleClick() {
        this.clickCount++;
        console.log("clicked:", this.clickCount);
 
        if (this.clickCount >= this.targetClicks) {
            this.onWin();
        }
    }
 
    onWin() {
        cancelAnimationFrame(this.animFrame);
        setTimeout(() => this.returnToWorld(), 2200);
    }
 
    returnToWorld() {
        cancelAnimationFrame(this.animFrame);
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
 
        world = new World({ element: this.element });
        world.init();
    }
}