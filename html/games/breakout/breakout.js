var canvas = document.getElementById('breakoutCanvas');
var ctx = canvas.getContext("2d");                //gets reference to 2d context allowing drawing on canvas

//set starting point for ball
var x = canvas.width/2;
var y = canvas.height-30;

if (screen.width < 500){
  canvas.width = screen.width - 20;
}

var colorScheme = "#26BBBF"

//set direction of ball axis
var dx = 2;
var dy = -2;

var ballRadius = 10;

var ballSizeSlider = document.getElementById("ballSizeSlider");
ballSizeSlider.oninput = function (){
  ballRadius = this.value;
}

//builds paddle
var paddleHeight = 10;
var paddleWidth = 80;
var paddlePos = (canvas.width-paddleWidth)/2
var paddleSpeed = 7;
var paddleTouch = 0;
var superPaddle = document.getElementById("superPaddle")
superPaddle.onclick = function(){
  paddleWidth = canvas.width - 20;
  paddlePos = (canvas.width-paddleWidth)/2;
}

//sets boolean values for arrow presses
var rightPressed = false;
var leftPressed = false;

//value used to play or pause game based on if the mouse is over the canvas
var play = false;

//sets up stuff for the bricks
var brickRowCount = 3;
var brickColumnCount = 5;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickWidth = (canvas.width-(brickOffsetLeft*2)-(brickPadding*(brickColumnCount-1)))/brickColumnCount;

var rowSlider = document.getElementById("rowSlider");
  rowSlider.oninput = function (){
      brickRowCount = this.value;
    }

//creates brick array variables c and r represent columns and rows respectively
var bricks = [];
for(var r=0; r < 8; r++){
  bricks[r] = [];
  for(var c=0; c<brickColumnCount; c++){
    bricks[r][c] = {x: 0, y: 0, status: 1};
  }
}

var score = 0;

//draws the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x,y,ballRadius,0, Math.PI*2);           //draws circle
  ctx.fillStyle = colorScheme;                      //sets ball color
  ctx.fill();                                     //fills color into ball
  ctx.closePath();
};

//draws the paddle
function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddlePos, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = colorScheme;
  ctx.fill();
  ctx.closePath();
};

//function used to draw bricks to the canvas
function drawBricks(){
  for (r=0; r<brickRowCount; r++){                                   //loop for drawing multiple bricks at once
    for (c=0; c<brickColumnCount; c++){
      if (bricks[r][c].status == 1){
        var brickX = (c*(brickWidth+brickPadding)) + brickOffsetLeft;   //as the loop adds to the c variable, multiplying it with brickWidth and brickPadding creates new bricks spaced apart
        var brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
        bricks[r][c].x = brickX;                                        //sets dimensions of each brick in the array to the current brickX and brickY values in the loop
        bricks[r][c].y = brickY;
        ctx.beginPath();                                                //draws the brick
        ctx.rect(brickX,brickY, brickWidth, brickHeight);
        ctx.fillStyle = colorScheme;
        ctx.fill();
        ctx.closePath;
      }
    }
  }
}

//function used to render game
function draw(){
  ctx.clearRect(0,0,canvas.width, canvas.height); //clears canvas before new frame
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawPaddleTouch();
  collisionDetection();
  hideCursor();
  if (play){
    x += dx;                                        //updates axis value (moves ball)
    y += dy;

    if(x > canvas.width-ballRadius || x < ballRadius){     //changes ball direction if hits left or right
      dx = -dx;
    };

    if(y < ballRadius){    //changes ball direction if hits tops
      dy = -dy;
    } else if( y > canvas.height-ballRadius-(paddleHeight/5)){                  //checks if ball hits bottom
      if (x > paddlePos - ballRadius && x < paddlePos + paddleWidth + ballRadius) {
        var paddleCenter = paddlePos + (paddleWidth/2);
        dx = (x - paddleCenter)/10;
        dy = -dy;
        paddleTouch ++;
      } else {
      play = false;
      alert("GAME OVER");
      document.location.reload();
      }
    }

    if(leftPressed && paddlePos >= 0){                               //moves paddle within canvas based on key up/down events
      paddlePos -= paddleSpeed;
    } else if (rightPressed && paddlePos <= canvas.width-paddleWidth){
      paddlePos += paddleSpeed;
    };
  };
requestAnimationFrame(draw);                                       //tells browser to keep refreshing this canvas
};

//these are used to create handlers in js for HTML events
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touchmove", touchHandler, false);

//detects mouse movement as mousemove event is sent to this function
function mouseMoveHandler(e){
  var relativeX = e.clientX - canvas.offsetLeft;
  var relativeY = e.clientY - canvas.offsetTop;                    //creates relativeX and sets it equal to the position of the mouse (clientX)
  if(relativeX > 0 && relativeX < canvas.width && relativeY > 0 && relativeY < canvas.height){                    //if the mouse is within the canvas dimensions, set relativeX equal to the center of the paddle and set play equal to true
    play = true;
    paddlePos = relativeX - paddleWidth/2;
  } else {
    play = false;
  }
}

//function used to detect touches on touchscreens
function touchHandler (e){
  var relativeX = e.touches[0].clientX - canvas.offsetLeft;
  var relativeY = e.touches[0].clientY - canvas.offsetTop;
  if (relativeX > 0 && relativeX < canvas.width && relativeY > 0){
    //prevents vertical scolling when over or below the game canvas
    var body = document.getElementById("breakoutBody");
    var html = document.getElementById("breakoutHTML");
    body.style.overflowY = "hidden";
    body.style.position = "relative";
    html.style.overflowY = "hidden";
    play = true;
    paddlePos = relativeX - paddleWidth/2;
  } else {
    play = false;
    //allows vertical scrolling when user moves finger off game canvas or below
    var body = document.getElementById("breakoutBody");
    var html = document.getElementById("breakoutHTML");
    body.style.overflowY = "auto";
    body.style.position = "static";
    html.style.overflowY = "auto";
  }
}

//function used to handle pressing an arrow key down
//the variable "e" stores the keydown event
//39 and 37 are the keycodes for the right and left arrow keys respectively
function keyDownHandler(e){
  if(e.keyCode == 39){
    rightPressed = true;
    play = true;
  } else if (e.keyCode == 37){
    leftPressed = true;
    play = true;
  }
}

//same as keyDownHandler, but sets bolean values back to false on keyup
function keyUpHandler(e){
  if(e.keyCode == 39){
    rightPressed = false;
  } else if (e.keyCode == 37){
    leftPressed = false;
  }
}

//speeds ball after each brick hit
function speedUp(){
  if (dx < 0 && dy < 0){
    dx -= .5;
    dy -= .5;
  } else if (dx < 0 && dy > 0) {
    dx -= .5;
    dy += .5;
  } else if (dx > 0 && dy < 0){
    dx += .5;
    dy -= .5;
  } else {
    dx += .5;
    dy += .5;
  }
}

//checks for ball hitting brick
function collisionDetection(){
  for (var r=0; r < brickRowCount; r++){                       //loops used to check each brick for each frame
    for (var c=0; c < brickColumnCount; c++){
      var b = bricks[r][c];
      if(b.status == 1){                                          //makes sure status hasn't been changed to 0
        if (x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){ //checks if ball is inside brick
          dy = -dy;
          speedUp();
          b.status = 0;                                           //sets brick status to 0 if brick was hit. brick doesn't render in next frame
          score++;
          if(score == brickRowCount * brickColumnCount){          //if score equals number of bricks, alerts a win
            alert("YOU WIN!!! You broke " + brickRowCount*brickColumnCount + " bricks with " + paddleTouch + " paddle touches");
            document.location.reload();
          }
        }
      }
    }
  }
}

//draws score in top left corner
function drawScore(){
  ctx.font = "16px Arial";
  ctx.fillStyle = colorScheme;
  ctx.fillText("Score: "+ score, 8, 20);                         //tells fillText what to write, and where to write it
}

//draws paddleTouch value in top right corner
function drawPaddleTouch(){
  ctx.font = "16px Arial";
  ctx.fillyStyle = colorScheme;
  if (paddleTouch < 10){
  ctx.fillText("Paddle Touches: "+ paddleTouch, canvas.width - 140, 20);
  } else {
  ctx.fillText("Paddle Touches: "+ paddleTouch, canvas.width - 150, 20);
  }
}

//hides cursor when over canvas
function hideCursor (){
  document.getElementById("breakoutCanvas").style.cursor = "none";
}

draw();
