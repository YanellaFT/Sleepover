class Directions {
    constructor() {
        this.heldDirections = [];
        this.map = {
            "ArrowUp": "up",
            "ArrowDown": "down",
            "ArrowLeft": "left",
            "ArrowRight": "right",
        };

        this._onKeyDown = (e) => {
            const direct = this.map[e.code];
            if (direct && this.heldDirections.indexOf(direct) === -1) {
                this.heldDirections.unshift(direct);
            }
        };

        this._onKeyUp = (e) => {
            const dir = this.map[e.code];
            const index = this.heldDirections.indexOf(dir);
            if (index > -1) {
                this.heldDirections.splice(index, 1);
            }
        };
    }

    init() {
        document.addEventListener("keydown", this._onKeyDown);
        document.addEventListener("keyup", this._onKeyUp);
    }

    destroy() {
        document.removeEventListener("keydown", this._onKeyDown);
        document.removeEventListener("keyup", this._onKeyUp);
    }

    get direction() {
        return this.heldDirections[0];
    }
}