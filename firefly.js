class Firefly {
    constructor() {
        this.position = { x: random(0, 1200), y: random(0, 800) };
        this.speed = { x: random(-1, 1), y: random(-1, 1) };
        this.directChangeInt = random(1000, 3000);
        this.lastDirectChange = Date.now();
        
        this.caught = false;

        this.image = new Image();
        this.image.src = "/assets/firefly.png";
    }

    update() {
        if (Date.now() - this.lastDirectChange > this.directChangeInt) {
            this.speed.x = random(-2, 2);
            this.speed.y = random(-2, 2);
            this.directChangeInt = random(1000, 3000);
            this.lastDirectChange = Date.now();
        }
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        // console.log(this.position);
        if (this.position.y < 266) this.position.y = 266;
        // if (this.position.x < 500 && 266 < this.position.y < 290) this.position.x = 500, this.position.y = 500;
        if (this.position.x > 1056) this.position.x = 1056;
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.y > 680) this.position.y = 680;

        let distance = Math.sqrt((world.playerPos.x - this.position.x) ** 2 + (world.playerPos.y - this.position.y) ** 2);
        if (distance < 60) {
            this.caught = true;
            console.log("caught");
        }
    }
}