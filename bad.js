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
        this.spawnInterval = null;

        this.music = new Audio("./assets/audio/badDreamMusic.mp3");
        this.music.loop = true;
    }
 
    init() {
        this.background.src = "./assets/badDreamBG.png";
        this.background.onload = () => {
            this.ctx.drawImage(this.background, 0, 0);
            this.music.play().catch(() => {});
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
 
        const button = document.createElement("img");
        button.src = "./assets/button.png";
        Object.assign(button.style, {
            position: "absolute",
            width: "800px",
            height: "800px",
            top: "calc(50% + 180px)",
            left: "50%",
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
            zIndex: "12",
        });

        button.addEventListener("click", () => this.handleClick());
        this.overlay.appendChild(button);
        this.element.appendChild(this.overlay);

        this.spawnbrainrot();
    }

    spawnbrainrot() {
        const brainrotFiles = [
            "./assets/brainrot/67meme.png",
            "./assets/brainrot/cornballmeme.png",
            "./assets/brainrot/highcortisolmeme.png",
            "./assets/brainrot/JoshHutchersonmeme.png",
            "./assets/brainrot/mondayleftmebrokenmeme.png",
            "./assets/brainrot/nichefruitmeme.png",
            "./assets/brainrot/rickrollmeme.png",
            "./assets/brainrot/sonionmeme.jpg"
        ];

        const spawn = () => {
            if (!this.overlay || !this.overlay.parentNode) return;

            const img = document.createElement("img");
            img.src = brainrotFiles[Math.floor(Math.random() * brainrotFiles.length)];

            const size = 80 + Math.random() * 100;
            const x = Math.random() * (this.canvas.width - size);
            const y = Math.random() * (this.canvas.height - size);

            Object.assign(img.style, {
                position: "absolute",
                width: `${size}px`,
                height: `${size}px`,
                objectFit: "cover",
                borderRadius: "8px",
                left: `${x}px`,
                top: `${y}px`,
                zIndex: "11",
                pointerEvents: "none",
            });

            this.overlay.appendChild(img);

            const lifetime = 600 + Math.random() * 1600;
            setTimeout(() => {
                img.style.opacity = "0";
                setTimeout(() => img.remove(), 400);
            }, lifetime);

            const delay = Math.max(80, 500 - (this.clickCount / this.targetClicks) * 500);
            this.spawnInterval = setTimeout(spawn, delay);
        };

        spawn();
    }
 
    handleClick() {
        this.clickCount++;
        // console.log("clicked:", this.clickCount);
 
        if (this.clickCount >= this.targetClicks) {
            this.onWin();
        }
    }

    drawScene() {
        const shakeX = (Math.random() - 0.5) * 16;
        const shakeY = (Math.random() - 0.5) * 16;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.background, shakeX, shakeY, this.canvas.width, this.canvas.height);

        this.animationId = requestAnimationFrame(() => this.drawScene());
    }
 
    onWin() {
        clearTimeout(this.spawnInterval);
        this.spawnInterval = null;
 
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
            this.overlay = null;
        }
 
        this.drawScene();
 
        setTimeout(() => {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
            this.returnToWorld();
        }, 2200);
    }
 
    returnToWorld() {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
 
        this.music.pause();
        this.music.currentTime = 0;
 
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        world = new World({ element: this.element });
        world.init();
    }
}