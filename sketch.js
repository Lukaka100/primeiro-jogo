var PLAY = 1;
var END = 0;
var gameState = PLAY;

var player, player_running, trex_collided;
var background, backgroundImg, backgroundSprite, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg;

var trex_collided;

var pulo;
var morte;

function preload(){
  player_running = loadAnimation("player1.gif", "player2.gif", "player3.gif", "player4.gif", "player5.gif");

  backgroundImg = loadImage("caverna.jpg");
  
  morcergo = loadImage("morcergo.gif");
  maozumbi = loadImage("maozumbi.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  morte = loadSound("die.mp3");
  pulo = loadSound("jump.mp3");
}

function setup() {
  createCanvas(1325, 619);

  backgroundSprite = createSprite(0,0,400,200);
  backgroundSprite.addImage("background", backgroundImg);
  backgroundSprite.x = background.width /2;
  backgroundSprite.scale = 3.4

  player = createSprite(50,height-70,20,50);
  player.addAnimation("running", player_running)
 
  gameOver = createSprite(width/2,height/2 -50,);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;

  obstaclesGroup = createGroup();
  
  score = 0;

  player.setCollider("circle", 0, 0, 40,);
  player.debug = false;
}

function draw() {
  background("green");
  text("Pontuação: "+ score, 500,50);
  
  if(gameState === PLAY) {
     gameOver.visible = false;
    restart.visible = false;
    backgroundSprite.velocityX = -3;
    score = score + Math.round(getFrameRate()/60);
    
    if(score > 0 && score%500 == 0){
      checkpoint.play()
    }

    if (backgroundSprite.x < 0){
      backgroundSprite.x = backgroundSprite.width/2;
    }

    if(touches.length>0 || keyDown("space")&& player.y >= height-175) {
        player.velocityY = -9;
        pulo.play();
        touches = [];      
      }
  
    player.velocityY = player.velocityY + 0.8
  
    spawnClouds();
  
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(player)){
        gameState = END;
        morte.play()
    }
  }
   else if (gameState === END) {
      backgroundSprite.velocityX = 0;

      gameOver.visible = true;
      restart.visible = true;

      backgroundSprite.velocityX = 0;
      player.velocityY = 0;

      player.changeAnimation("collided", trex_collided);

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);


     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
    }

  player.collide(invisibleGround);
  
  if(touches.length> 0 || mousePressedOver(restart)){
    reset();
    touches = [];
  }
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-85,20,30);
   obstacle.velocityX = -(6+score/500);
   
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
              
    obstacle.scale = 0.5;
    obstacle.lifetime =300;
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
   if (frameCount % 60 === 0) {
     cloud = createSprite(width+20,height-100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = 460;
    
    cloud.depth = player.depth;
    player.depth = player.depth + 1;
    
   cloudsGroup.add(cloud);
    }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
  player.changeAnimation("running", player_running);
}