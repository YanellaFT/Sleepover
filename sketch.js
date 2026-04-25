const world = new World({
  element: document.querySelector(".game-container")
});
world.init();



function random(min, max) {
    return Math.random() * (max - min) + min;
}


function getDream(dream) {
  const canvas = document.querySelector(".game-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (dream === 1) {
    const goodDream = new Good({
      element: document.querySelector(".game-container")
    });
    goodDream.init();
    console.log("good dream");
  } else if (dream === 2) {
    const badDream = new Bad({
      element: document.querySelector(".game-container")
    });
    badDream.init();
    console.log("bad dream");
  } else if (dream === 3) {
    console.log("jumpscare");
  } else {
    console.log("error");
  }
}

// function goodDream() {

// }

// function badDream() {

// }

// function jumpscare() {
  
// }