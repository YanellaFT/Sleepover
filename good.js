class Good {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        
        this.background = new Image();

        this.cards = []
        this.flipped = []
        this.matched = []
        this.lockBoard = false;
        this.overlay = null;
    }

    init() {
        this.background.src = "./assets/goodDreamBG.png";
        this.background.onload = () => {
            this.ctx.drawImage(this.background, 0, 0);
            setTimeout(() => this.startMemoryGame(), 600);
        };
    }

    startMemoryGame() {
        this.overlay = document.createElement("div");
        this.overlay.id = "memory-overlay";

        Object.assign(this.overlay.style, {
            position: "absolute",
            top: "0",
            left: "0",
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "10",
        });

        const grid = document.createElement("div");
        Object.assign(grid.style, {
            display: "grid",
            gridTemplateColumns: "repeat(4, 110px)",
            gridTemplateRows: "repeat(4, 110px)",
            gap: "12px",
            marginTop: "-150px"
        });
        this.overlay.appendChild(grid);

        const symbols = ["💫", "💭", "🪶", "😴", "💤", "🌙", "✨", "⭐"];
        const deck = [...symbols, ...symbols];

        for (let i = deck.length - 1; i > 0; i --) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        this.cards = []
        this.matched = []
        this.flipped = []

        deck.forEach((sym, idx) => {
            const card = document.createElement("div");
            card.dataset.symbol = sym;
            card.dataset.index = idx;

            Object.assign(card.style, {
                width: "110px",
                height: "110px",
                perspective: "600px",
                cursor: "pointer",
                position: "relative",
            });

            const inner = document.createElement("div");
            inner.className = "card-inner";
            Object.assign(inner.style, {
                width: "100%",
                height: "100%",
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 0.45s ease",
                borderRadius: "12px",
            });

            const front = document.createElement("div");
            Object.assign(front.style, {
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)",
                border: "2px solid #7c3aed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                color: "#7c3aed",
            });
            
            const back = document.createElement("div");
            Object.assign(back.style, {
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #fdf4ff 0%, #e9d5ff 100%)",
                border: "2px solid #c084fc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "46px",
            });
            back.textContent = sym;

            inner.appendChild(front);
            inner.appendChild(back);
            card.appendChild(inner);

            card.addEventListener("click", () => this.flipCard(card, inner, sym, idx));

            grid.appendChild(card);
            this.cards.push({card, inner, sym, idx, faceUp: false});
        });

        this.element.appendChild(this.overlay);
    }

    flipCard(card, inner, sym, idx) {
        if (this.lockBoard) return;
        
        const entry = this.cards[idx];
        if (entry.faceUp || this.matched.includes(idx)) return;

        inner.style.transform = 'rotateY(180deg)';
        entry.faceUp = true;
        this.flipped.push(idx);

        if (this.flipped.length === 2) {
            this.lockBoard = true;
            this.checkMatch();
        }
    }

    checkMatch() {
        const [a, b] = this.flipped;
        const cardA = this.cards[a];
        const cardB = this.cards[b];

        if (cardA.sym === cardB.sym) {
            this.matched.push(a, b);
            [cardA, cardB].forEach(c => {
                Object.assign(c.inner.style, {
                    background: "none",
                });
            
            c.inner.querySelector("div:last-child").style.background = "linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)";
        });

        this.flipped = []
        this.lockBoard = false;

        if (this.matched.length === this.cards.length) {
            setTimeout(() => this.onWin(), 700);

        }
    } else {
        setTimeout(() => {
            [cardA, cardB].forEach(c => {
                    c.inner.style.transform = "";
                    c.faceUp = false;
                });
                this.flipped = [];
                this.lockBoard = false;
            }, 900);
        }
    }

    onWin() {
        const msg = document.createElement("div");
        msg.textContent = "Sweet dreams!";

        Object.assign(msg.style, {
            color: "#7c3aed",
            fontSize: "28px",
            marginTop: "22px",
            letterSpacing:"2px",
            animation: "fadeInUp 0.6s ease forwards",
            fontFamily: "cursive"
        });

        if (!document.getElementById("good-anim-style")) {
            const style = document.createElement("style");
            style.id = "good-anim-style";
            style.textContent = `
                @keyframes fadeInUp {
                    from { opacity:0; transform: translateY(16px); }
                    to   { opacity:1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        this.overlay.appendChild(msg);
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