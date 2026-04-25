const world = new World({
  element: document.querySelector(".game-container")
});
world.init();



function random(min, max) {
    return Math.random() * (max - min) + min;
}


function getDream(dream) {
  if (dream === 1) {
    goodDream();
  } else if (dream === 2) {
    badDream();
  } else if (dream === 3) {
    jumpscare();
  } else {
    console.log("error");
  }
}

function goodDream() {

}

function badDream() {

}

function jumpscare() {
  
}