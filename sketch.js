(function() {
  
const world = new World({
  element: document.querySelector(".game-container")
});
world.init();

})();


function random(min, max) {
    return Math.random() * (max - min) + min;
}
