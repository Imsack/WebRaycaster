"use strict";
let texture;

function preload()
{
  texture = loadImage("testTexture.jpg");
}

function setup()
{
  noStroke();
  createCanvas(window.innerWidth / 1.5, window.innerHeight / 1.5);
}

function draw()
{
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
  ["#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#", "#", "#", "#", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", "#", " ", " ", "#", " ", " ", "#"],
  ["#", "#", "#", " ", "#", "#", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", "#", " ", " ", "#"],
  ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", "#", "#", "#", " ", " ", "#"],
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
  ["#", " ", "#", "#", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
  ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"]
];

function controls()
{
  let speed = deltaTime / 1000 * 3;

  if(keyIsDown(87)) //if W is held down
  {
    playerX += Math.cos(playerAngle) * speed;
    playerZ += Math.sin(playerAngle) * speed;
  }
  if(keyIsDown(65)) // if A is held down
  {
    playerX += Math.sin(playerAngle) * speed;
    playerZ -= Math.cos(playerAngle) * speed;
  }
  if(keyIsDown(83)) // if S is held down
  {
    playerX -= Math.cos(playerAngle) * speed;
    playerZ -= Math.sin(playerAngle) * speed;
  }
  if(keyIsDown(68)) // if D is held down
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

  collisionResolving();
}

function collisionResolving()
{
  //this function uses the circle vs rectangle collision algorithm to resolve collisions
  let sideRadius = 0.2;
  let adjustedSideRadius = sideRadius - 0.01;

  let tileX;
	let tileZ;

	for (let i = 0; i < 8; i++)
	{
		switch (i)
		{
      case 0: tileX = Math.floor(playerX); tileZ = Math.floor(playerZ) - 1; break;
      case 1: tileX = Math.floor(playerX); tileZ = Math.floor(playerZ) + 1; break;
      case 2: tileX = Math.floor(playerX) - 1; tileZ = Math.floor(playerZ); break;
      case 3: tileX = Math.floor(playerX) + 1; tileZ = Math.floor(playerZ); break;
      case 4: tileX = Math.floor(playerX) - 1; tileZ = Math.floor(playerZ) - 1; break;
      case 5: tileX = Math.floor(playerX) - 1; tileZ = Math.floor(playerZ) + 1; break;
      case 6: tileX = Math.floor(playerX) + 1; tileZ = Math.floor(playerZ) - 1; break;
      case 7: tileX = Math.floor(playerX) + 1; tileZ = Math.floor(playerZ) + 1; break;
	  }

		if (tileX >= 0 && tileX < mapWidth && tileZ >= 0 && tileZ < mapHeight)
		{
			if (map[tileZ][tileX] == "#")
			{
				let distanceToWallX = Math.abs(clamp(playerX, tileX, tileX + 1) - playerX);
				let distanceToWallZ = Math.abs(clamp(playerZ, tileZ, tileZ + 1) - playerZ);

				if (i <= 3 && distanceToWallX < sideRadius)
				{
					let directionX = tileX - Math.floor(playerX);
					playerX += (distanceToWallX - sideRadius) * directionX;
				}
				if (i <= 3 && distanceToWallZ < sideRadius)
				{
					let directionZ = tileZ - Math.floor(playerZ);
					playerZ += (distanceToWallZ - sideRadius) * directionZ;
				}
				if (i > 3 && distanceToWallX < adjustedSideRadius && distanceToWallZ < adjustedSideRadius)
				{
					let directionX = tileX - Math.floor(playerX);
					let directionZ = tileZ - Math.floor(playerZ);

					if(distanceToWallX > distanceToWallZ) { 
            playerX += (distanceToWallX - adjustedSideRadius) * directionX;
          } else {
            playerZ += (distanceToWallZ - adjustedSideRadius) * directionZ;
					}
				}
			}
		}
  }
}

function clamp(value, lower, upper)
{
  return Math.max(lower, Math.min(upper, value));
}

function rayCaster()
{
  let angle = 3.141592 / 4;
  let distanceForward = 40;
  let rayBound = Math.tan(angle) * distanceForward;
  let increment = (rayBound * 2) / width;

  let cosAngle = Math.cos(playerAngle);
  let sinAngle = Math.sin(playerAngle);

  let collumnNumber = 0;

  for (let x = -rayBound; x <= rayBound; x += increment)
  {
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
    
    //lol
    let inverseMaxLengthSquared =
      1.0 / (distanceForward * distanceForward + x * x);

    let collision = false;

    let textureX = 0;

    let deltaX = 0;
    let deltaZ = 0;

    while (stepsTaken <= distanceForward && collision == false)
    {
      stepsTaken += 1;

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
        //this line of code looks like this to make sure
        //that the texture is always going in the same direction on each face of a block
        textureX = (directionX == -1) + directionX * (rayZ - tileZ);
      } else {
        rayZ += deltaZ;
        rayX += xStep;
        tileZ += directionZ;
        //this line of code looks like this to make sure
        //that the texture is always going in the same direction on each face of a block
        textureX = (directionZ == 1) - directionZ * (rayX - tileX);
      }

      if (tileX < 0 || tileX >= mapWidth || tileZ < 0 || tileZ >= mapHeight)
      {
        break;
      }

      let length = 0;

      if (map[tileZ][tileX] == "#")
      {
        collision = true;

        let shadeAdder = 1;

        //directional shading
        if(rayX == tileX && rayZ != tileZ) shadeAdder = 3;

        let rayLengthSquared =
          (rayX - playerX) * (rayX - playerX) +
          (rayZ - playerZ) * (rayZ - playerZ);

        //this looks like a mess and is a mess. Although it avoids one more sqrt calculation.
        length = Math.sqrt(
          (rayLengthSquared - rayLengthSquared * inverseMaxLengthSquared * x * x)
        );

        let collumnHeight = height / length;

        let posY = height * 0.5 - collumnHeight * 0.5;

        let shade = 1 / (length * 0.3 + shadeAdder);

        image(texture, collumnNumber, posY, 1, collumnHeight, textureX * texture.width, 0, 1, texture.height);
        fill(0, 0, 0, 255 - shade * 255);
        rect(collumnNumber, posY, 1, collumnHeight);
      }
    }
    collumnNumber += 1;
  }
}
