class Bad {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");

        this.background = new Image();
        this.overlay = null;
        this.clickCount = 0;
        this.targetClicks = 50;
        this.orbiters = [];
        this.animFrame = null;
        this.startTime = null;
    }

    init() {
        this.background.src = "./assets/badDreamBG.png";
        this.background.onload = () => {
            this.ctx.drawImage(this.background, 0, 0);
            setTimeout(() => this.startMinigame(), 400);
        };
        this.background.onerror = () => {
            // fallback if image missing
            this.ctx.fillStyle = "#0a0010";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            setTimeout(() => this.startMinigame(), 400);
        };
    }

    startMinigame() {
        // --- Overlay ---
        this.overlay = document.createElement("div");
        this.overlay.id = "bad-dream-overlay";
        Object.assign(this.overlay.style, {
            position:       "absolute",
            top:            "0",
            left:           "0",
            width:          "100%",
            height:         "100%",
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            zIndex:         "10",
            overflow:       "hidden",
            fontFamily:     "'Comic Sans MS', 'Chalkboard SE', cursive",
        });

        // Dark vignette layer
        const vignette = document.createElement("div");
        Object.assign(vignette.style, {
            position:   "absolute",
            inset:      "0",
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)",
            zIndex:     "0",
            pointerEvents: "none",
        });
        this.overlay.appendChild(vignette);

        // Shaking title
        const title = document.createElement("div");
        title.textContent = "WAKE UP!!!";
        title.id = "bad-title";
        Object.assign(title.style, {
            color:       "#ff2222",
            fontSize:    "48px",
            fontWeight:  "900",
            textShadow:  "0 0 20px #ff0000, 0 0 60px #ff0000, 3px 3px 0 #000",
            marginBottom:"12px",
            zIndex:      "2",
            position:    "relative",
            letterSpacing: "6px",
            animation:   "badShake 0.15s infinite",
        });
        this.overlay.appendChild(title);

        // Instruction
        const instruction = document.createElement("div");
        instruction.textContent = "click the button 50 times to escape the nightmare!";
        Object.assign(instruction.style, {
            color:       "#ffcc00",
            fontSize:    "15px",
            marginBottom:"28px",
            zIndex:      "2",
            position:    "relative",
            textShadow:  "1px 1px 4px #000",
            letterSpacing: "1px",
        });
        this.overlay.appendChild(instruction);

        // Button wrapper (for positioning orbiters relative to button)
        this.buttonWrap = document.createElement("div");
        Object.assign(this.buttonWrap.style, {
            position:   "relative",
            zIndex:     "2",
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
            width:      "220px",
            height:     "220px",
        });

        // The button
        this.btn = document.createElement("button");
        this.btn.textContent = "CLICK ME";
        Object.assign(this.btn.style, {
            width:        "120px",
            height:       "120px",
            borderRadius: "50%",
            border:       "4px solid #ff2222",
            background:   "radial-gradient(circle at 40% 35%, #ff4444, #880000)",
            color:        "#fff",
            fontSize:     "18px",
            fontWeight:   "900",
            cursor:       "pointer",
            boxShadow:    "0 0 30px #ff0000, 0 0 60px rgba(255,0,0,0.4), inset 0 2px 6px rgba(255,255,255,0.3)",
            transition:   "transform 0.08s, box-shadow 0.08s",
            fontFamily:   "'Comic Sans MS', cursive",
            letterSpacing:"1px",
            position:     "relative",
            zIndex:       "3",
            userSelect:   "none",
            WebkitUserSelect: "none",
        });

        this.btn.addEventListener("mouseenter", () => {
            this.btn.style.boxShadow = "0 0 50px #ff0000, 0 0 100px rgba(255,0,0,0.6), inset 0 2px 6px rgba(255,255,255,0.3)";
        });
        this.btn.addEventListener("mouseleave", () => {
            this.btn.style.boxShadow = "0 0 30px #ff0000, 0 0 60px rgba(255,0,0,0.4), inset 0 2px 6px rgba(255,255,255,0.3)";
        });

        this.btn.addEventListener("click", () => this.handleClick());

        this.buttonWrap.appendChild(this.btn);
        this.overlay.appendChild(this.buttonWrap);

        // Counter display
        this.counter = document.createElement("div");
        this.counter.textContent = `0 / ${this.targetClicks}`;
        Object.assign(this.counter.style, {
            color:       "#ffffff",
            fontSize:    "28px",
            fontWeight:  "700",
            marginTop:   "18px",
            zIndex:      "2",
            position:    "relative",
            textShadow:  "0 0 10px #ff0000, 2px 2px 0 #000",
        });
        this.overlay.appendChild(this.counter);

        // CSS animations
        if (!document.getElementById("bad-anim-style")) {
            const style = document.createElement("style");
            style.id = "bad-anim-style";
            style.textContent = `
                @keyframes badShake {
                    0%   { transform: translate(0,0) rotate(-1deg); }
                    25%  { transform: translate(-3px, 2px) rotate(1deg); }
                    50%  { transform: translate(3px, -2px) rotate(-1deg); }
                    75%  { transform: translate(-2px, 3px) rotate(0.5deg); }
                    100% { transform: translate(0,0) rotate(1deg); }
                }
                @keyframes orbiterSpin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes badWin {
                    0%   { opacity:0; transform: scale(0.5) rotate(-10deg); }
                    60%  { opacity:1; transform: scale(1.15) rotate(3deg); }
                    100% { opacity:1; transform: scale(1) rotate(0deg); }
                }
                #bad-dream-overlay button:active {
                    transform: scale(0.88) !important;
                }
            `;
            document.head.appendChild(style);
        }

        this.element.appendChild(this.overlay);

        // Start brain rot orbiters
        this.startOrbiters();
    }

    startOrbiters() {
        const brainRot = [
            "🗿", "💀", "🤡", "😱", "👁️", "🧠", "💊", "🐍",
            "⚡", "🔥", "😈", "👾", "🕷️", "🩸", "🫀", "🧿",
            "🎃", "👻", "😵", "🤪", "🫠", "💩", "🤢", "😤"
        ];

        const numOrbiters = 12;
        const canvasW = this.canvas.width;   // 1200
        const canvasH = this.canvas.height;  // 800

        // Center of the overlay (canvas center)
        const cx = canvasW / 2;
        const cy = canvasH / 2;

        // We'll have 2 rings orbiting at different radii and speeds
        this.orbiterData = [];

        for (let i = 0; i < numOrbiters; i++) {
            const ring = i < 6 ? 0 : 1;
            const baseRadius = ring === 0 ? 170 : 260;
            const speedMult = ring === 0 ? 1 : -0.65; // inner faster, outer reverses
            const angleOffset = (i % 6) * (Math.PI * 2 / 6) + (ring * Math.PI / 6);
            const symbol = brainRot[i % brainRot.length];
            const size = ring === 0 ? 36 : 28;
            const wobble = Math.random() * 20; // radius wobble amount
            const wobbleSpeed = 0.5 + Math.random() * 1.5;

            // Create DOM element for orbiter
            const el = document.createElement("div");
            el.textContent = symbol;
            Object.assign(el.style, {
                position:   "absolute",
                fontSize:   `${size}px`,
                zIndex:     "1",
                pointerEvents: "none",
                userSelect: "none",
                lineHeight: "1",
                filter:     ring === 0 ? "drop-shadow(0 0 8px rgba(255,0,0,0.8))" : "drop-shadow(0 0 6px rgba(255,200,0,0.7))",
                transition: "none",
                top:        "0",
                left:       "0",
            });
            this.overlay.appendChild(el);

            this.orbiterData.push({
                el, ring, baseRadius, speedMult, angleOffset, symbol,
                size, wobble, wobbleSpeed, currentAngle: angleOffset
            });
        }

        // Also add some random floating emojis in background
        this.floaters = [];
        for (let i = 0; i < 20; i++) {
            const el = document.createElement("div");
            el.textContent = brainRot[Math.floor(Math.random() * brainRot.length)];
            Object.assign(el.style, {
                position:   "absolute",
                fontSize:   `${16 + Math.random() * 30}px`,
                left:       `${Math.random() * 95}%`,
                top:        `${Math.random() * 90}%`,
                zIndex:     "0",
                pointerEvents: "none",
                userSelect: "none",
                opacity:    "0.18",
                filter:     "blur(1px)",
                animation:  `badShake ${0.3 + Math.random() * 0.5}s infinite`,
            });
            this.overlay.appendChild(el);
            this.floaters.push(el);
        }

        this.startTime = performance.now();
        this.animateOrbiters();
    }

    animateOrbiters() {
        if (!this.overlay || !this.overlay.parentNode) return;

        const now = performance.now();
        const elapsed = (now - this.startTime) / 1000; // seconds

        // Canvas center in overlay-relative coords
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        // As clicks increase, speed up
        const speedFactor = 1 + (this.clickCount / this.targetClicks) * 3.5;

        for (const o of this.orbiterData) {
            const baseSpeed = 0.9 * o.speedMult;
            o.currentAngle = o.angleOffset + elapsed * baseSpeed * speedFactor;

            const wobbledRadius = o.baseRadius + Math.sin(elapsed * o.wobbleSpeed) * o.wobble;

            const x = cx + Math.cos(o.currentAngle) * wobbledRadius;
            const y = cy + Math.sin(o.currentAngle) * wobbledRadius * 0.55; // ellipse

            // Position: offset by half emoji size so it's centered
            const halfSize = o.size / 2;
            o.el.style.transform = `translate(${x - halfSize}px, ${y - halfSize}px) rotate(${o.currentAngle * 30}deg)`;
        }

        // Shake button more as clicks approach target
        const intensity = this.clickCount / this.targetClicks;
        if (this.btn) {
            const shakeX = (Math.random() - 0.5) * intensity * 12;
            const shakeY = (Math.random() - 0.5) * intensity * 12;
            this.btn.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
        }

        this.animFrame = requestAnimationFrame(() => this.animateOrbiters());
    }

    handleClick() {
        this.clickCount++;

        // Visual click feedback
        this.btn.style.background = "radial-gradient(circle at 40% 35%, #ffaa00, #ff4400)";
        setTimeout(() => {
            if (this.btn) this.btn.style.background = "radial-gradient(circle at 40% 35%, #ff4444, #880000)";
        }, 80);

        // Update counter
        const remaining = this.targetClicks - this.clickCount;
        this.counter.textContent = `${this.clickCount} / ${this.targetClicks}`;

        // Color shift as you get closer
        const ratio = this.clickCount / this.targetClicks;
        const g = Math.floor(ratio * 200);
        this.counter.style.color = `rgb(255, ${g}, ${Math.floor((1 - ratio) * 255)})`;

        // Spook the button position randomly more as clicks increase
        if (ratio > 0.3 && ratio < 1.0) {
            const maxJump = ratio * 60;
            const jumpX = (Math.random() - 0.5) * maxJump;
            const jumpY = (Math.random() - 0.5) * maxJump;
            const bw = this.buttonWrap;
            const curLeft = parseFloat(bw.style.left) || 0;
            const curTop  = parseFloat(bw.style.top)  || 0;
            bw.style.position = "relative";
            bw.style.left = `${jumpX}px`;
            bw.style.top  = `${jumpY}px`;
        }

        // Spawn a burst emoji at random position
        this.spawnBurst();

        if (this.clickCount >= this.targetClicks) {
            this.onWin();
        }
    }

    spawnBurst() {
        const emojis = ["💥","✨","⚡","🌟","💢","🔥","❗","‼️"];
        const el = document.createElement("div");
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        Object.assign(el.style, {
            position:   "absolute",
            fontSize:   `${24 + Math.random() * 20}px`,
            left:       `${10 + Math.random() * 80}%`,
            top:        `${10 + Math.random() * 80}%`,
            zIndex:     "5",
            pointerEvents: "none",
            userSelect: "none",
            transition: "opacity 0.5s, transform 0.5s",
            opacity:    "1",
        });
        this.overlay.appendChild(el);
        requestAnimationFrame(() => {
            el.style.opacity    = "0";
            el.style.transform  = `translateY(-40px) scale(1.5)`;
        });
        setTimeout(() => el.remove(), 600);
    }

    onWin() {
        cancelAnimationFrame(this.animFrame);
        this.animFrame = null;

        // Hide button and orbiters
        this.btn.style.display = "none";
        for (const o of this.orbiterData) o.el.style.display = "none";

        const msg = document.createElement("div");
        msg.textContent = "You woke up! 😤";
        Object.assign(msg.style, {
            color:       "#00ff88",
            fontSize:    "52px",
            fontWeight:  "900",
            textShadow:  "0 0 30px #00ff88, 0 0 80px #00cc66, 3px 3px 0 #003322",
            animation:   "badWin 0.6s ease forwards",
            zIndex:      "10",
            position:    "relative",
            letterSpacing: "4px",
        });
        this.overlay.appendChild(msg);

        setTimeout(() => this.returnToWorld(), 2200);
    }

    returnToWorld() {
        cancelAnimationFrame(this.animFrame);
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const newWorld = new World({ element: this.element });
        newWorld.init();
    }
}



class Bad {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
 
        this.background = new Image();
        this.overlay = null;
        this.clickCount = 0;
        this.targetClicks = 50;
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "10",
            overflow: "hidden",
        });
 
        const button = document.createElement("img");
        button.src = "./assets/button.png";
        Object.assign(button.style, {
            width: "120px",
            height: "120px",
            cursor: "pointer",
            display: "block",
            // fallback border so you can see it even if the image fails
            border: "3px solid red",
            backgroundColor: "darkred",
        });
 
        // if the image fails to load, show a text button instead
        button.onerror = () => {
            button.style.display = "none";
 
            const fallback = document.createElement("button");
            fallback.textContent = "CLICK ME";
            Object.assign(fallback.style, {
                width: "120px",
                height: "120px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "900",
                background: "darkred",
                color: "white",
                border: "3px solid red",
                borderRadius: "12px",
            });
            fallback.addEventListener("click", () => this.handleClick());
            this.overlay.appendChild(fallback);
        };
 
        button.addEventListener("click", () => this.handleClick());
 
        this.overlay.appendChild(button);
        this.element.appendChild(this.overlay);
 
        console.log("bad dream overlay appended, button src:", button.src);
    }
 
    handleClick() {
        this.clickCount++;
        console.log("clicked:", this.clickCount);
 
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
 