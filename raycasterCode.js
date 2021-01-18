let screenWidth = 1080;
let screenHeight = 720;

function rayCaster() {
  let angle = 3.141592 * 0.5;
  let distanceForward = 5;
  let rayBound = tan(angle) * distanceForward;
  let incrementX = (rayBound * 2) / screenWidth;

  for (let x = -rayBound; x <= rayBound; x += incrementX) {
    let ySlope = x / distanceForward;
    let incrementY = 0;
    let collisionDetected = false;
    while (incrementY < forwardDistance && collisionDetected == false) {
      let mapX = incrementY * ySlope;
      incrementY += 0.01;
    }
  }
}
