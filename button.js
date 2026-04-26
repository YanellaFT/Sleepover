class Button
var direction;
function drawBorder() {
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "white";
ctx.fillRect(100, 100, 200, 50);
}
function isInsideButton(pos, rect) {
    return pos.x > rect.x && pos.x+rect.width && pos.y < rect.height && pos.y > rect.y;
}
var spamButton = {
    x:150,
    y:180,
    width:50,
    height:50,
    statis:"line"
}
function getMousePos(canvas, event) (
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clentX - rect.left,
        y: event.clientY - rect.top
    };
)
canvas.
    }
)
var interval = setInterval(function () {
    drawBorder();
}, 10)