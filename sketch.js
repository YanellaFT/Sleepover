(function() {
  
const world = new World({
  element: document.querySelector(".game-container")
});
world.init();

})();


function random(min, max) {
    return Math.random() * (max - min) + min;
}


import { Firefly2 } from "./firefly.js";
console.log(Firefly2);