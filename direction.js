class Directions {
    constructor() {
        this.heldDirections = [];
        this.map = {
            "ArrowUp": "up",
            "ArrowDown": "down",
            "ArrowLeft": "left",
            "ArrowRight": "right",
        }
    }

    init() {
        document.addEventListener("keydown", e=> {
            const direct = this.map[e.code];
            if (direct && this.heldDirections.indexOf(direct) === -1) {
                this.heldDirections.unshift(direct);
            }
        });

        document.addEventListener("keyup", e => {
            const dir = this.map[e.code];
            const index = this.heldDirections.indexOf(dir);
            if (index > -1) {
                this.heldDirections.splice(index, 1);
            }
        });
    }

    get direction() {
        return this.heldDirections[0];
    }
}