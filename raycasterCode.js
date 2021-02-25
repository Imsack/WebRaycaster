"use strict";
let texture;

function preload()
{
  texture = loadImage("testTexture.jpg");
}

function setup() {
  noStroke();
  createCanvas(800, 400);
}

function draw() {
  background(0);
  controls();
  rayCaster();
}

let mapWidth = 20;
let mapHeight = 25;
let playerX = 3.1;
let playerZ = 5.1;
let playerAngle = 3.141592;

let map = [
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", "#", "#", "#", "#", "#", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"]
];

function controls() {
  let speed = deltaTime / 1000 * 3;

  if(keyIsDown(87))
  {
    playerX += Math.cos(playerAngle) * speed;
    playerZ += Math.sin(playerAngle) * speed;
  }
  if(keyIsDown(65))
  {
    playerX += Math.sin(playerAngle) * speed;
    playerZ -= Math.cos(playerAngle) * speed;
  }
  if(keyIsDown(83))
  {
    playerX -= Math.cos(playerAngle) * speed;
    playerZ -= Math.sin(playerAngle) * speed;
  }
  if(keyIsDown(68))
  {
    playerX -= Math.sin(playerAngle) * speed;
    playerZ += Math.cos(playerAngle) * speed;
  }

  if(keyIsDown(RIGHT_ARROW))
  {
    playerAngle += speed;
  }
  if(keyIsDown(LEFT_ARROW))
  {
    playerAngle -= speed;
  }
}

function rayCaster() {
  let angle = 3.141592 / 4;
  let distanceForward = 40;
  let rayBound = Math.tan(angle) * distanceForward;
  let increment = (rayBound * 2) / width;

  let cosAngle = Math.cos(playerAngle);
  let sinAngle = Math.sin(playerAngle);

  let collumnNumber = 0;

  for (let x = -rayBound; x <= rayBound; x += increment) {
    let rotatedX = cosAngle * distanceForward - sinAngle * x;
    let rotatedZ = sinAngle * distanceForward + cosAngle * x;

    let gradientX = rotatedZ / rotatedX;
    let gradientZ = rotatedX / rotatedZ;

    let rayX = playerX;
    let rayZ = playerZ;

    let tileX = Math.floor(playerX);
    let tileZ = Math.floor(playerZ);

    let directionX = rotatedX / Math.abs(rotatedX);
    let directionZ = rotatedZ / Math.abs(rotatedZ);

    let stepsTaken = 0;

    let inverseMaxLengthSquared =
      1.0 / (distanceForward * distanceForward + x * x);

    let collision = false;

    let textureX = 0;

    while (stepsTaken <= distanceForward && collision == false) {

      stepsTaken += 1;

      let deltaX = 0;
      let deltaZ = 0;

      if (directionX == 1) {
        deltaX = tileX + directionX - rayX;
      } else {
        deltaX = Math.ceil(rayX) + directionX - rayX;
      }

      if (directionZ == 1) {
        deltaZ = tileZ + directionZ - rayZ;
      } else {
        deltaZ = Math.ceil(rayZ) + directionZ - rayZ;
      }

      let zStep = gradientX * deltaX;
      let xStep = gradientZ * deltaZ;

      if (deltaX * deltaX + zStep * zStep < deltaZ * deltaZ + xStep * xStep) {
        rayX += deltaX;
        rayZ += zStep;
        tileX += directionX;
        textureX = Math.abs(rayZ - tileZ);
      } else {
        rayZ += deltaZ;
        rayX += xStep;
        tileZ += directionZ;
        textureX = Math.abs(rayX - tileX);
      }

      if (tileX < 0 || tileX >= mapWidth || tileZ < 0 || tileZ >= mapHeight) {
        break;
      }

      let length = 0;

      if (map[tileZ][tileX] == "#") {
        collision = true;

        let shadeMultiplier = 6;

        if(rayX == tileX && rayZ != tileZ) shadeMultiplier = 10.5;

        let rayLengthSquared =
          (rayX - playerX) * (rayX - playerX) +
          (rayZ - playerZ) * (rayZ - playerZ);

        length = Math.sqrt(
          (rayLengthSquared - rayLengthSquared * inverseMaxLengthSquared * x * x)
        );

        let collumnHeight = height / length;

        let posY = height * 0.5 - collumnHeight * 0.5;

        let shade = shadeMultiplier / (length * 1.2 + 10);

        image(texture, collumnNumber, posY, 1, collumnHeight, textureX * texture.width, 0, 1, texture.height);
        fill(0, 0, 0, 255 - shade * 255);
        rect(collumnNumber, posY, 1, collumnHeight);
      }
    }
    collumnNumber += 1;
  }
}
