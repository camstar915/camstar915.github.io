var canvas = document.getElementById('breakoutCanvas');
var ctx = canvas.getContext("2d");                //gets reference to 2d context allowing drawing on canvas

//set starting point for ball
var x = canvas.width/2;
var y = canvas.height-30;

//set direction of ball axis
var dx = 2;
var dy = -2;

var ballRadius = 10;

//builds paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddlePos = (canvas.width-paddleWidth)/2
var paddleSpeed = 7;

//sets boolean values for arrow presses
var rightPressed = false;
var leftPressed = false;

//value used to play or pause game based on if the mouse is over the canvas
var play = false;

//sets up stuff for the bricks
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

//creates brick array variables c and r represent columns and rows respectively
var bricks = [];
for(var c=0; c<brickColumnCount; c++){
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++){
    bricks[c][r] = {x: 0, y: 0, status: 1};
  }
}

var score = 0;

//draws the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x,y,ballRadius,0, Math.PI*2);           //draws circle
  ctx.fillStyle = "#0095DD";                      //sets ball color
  ctx.fill();                                     //fills color into ball
  ctx.closePath();
};

function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddlePos, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
};

//function used to draw bricks to the canvas
function drawBricks(){
  for (c=0; c<brickColumnCount; c++){                                   //loop for drawing multiple bricks at once
    for (r=0; r<brickRowCount; r++){
      if (bricks[c][r].status == 1){
        var brickX = (c*(brickWidth+brickPadding)) + brickOffsetLeft;   //as the loop adds to the c variable, multiplying it with brickWidth and brickPadding creates new bricks spaced apart
        var brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;                                        //sets dimensions of each brick in the array to the current brickX and brickY values in the loop
        bricks[c][r].y = brickY;
        ctx.beginPath();                                                //draws the brick
        ctx.rect(brickX,brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
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
  collisionDetection();
  hideCursor();
  if (play){
    x += dx;                                        //updates axis value (moves ball)
    y += dy;

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius){     //changes ball direction if hits left or right
      dx = -dx;
    };

    if(y + dy < ballRadius){    //changes ball direction if hits tops
      dy = -dy;
    } else if( y + dy > canvas.height-ballRadius){                  //checks if ball hits bottom
      if (x > paddlePos && x < paddlePos + paddleWidth) {
        dy = -dy;
      } else {
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
document.addEventListener("touchmove", touchHandler);

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
  var relativeX = e.touches[0].pageX - canvas.offsetLeft;
  var relativeY = e.touches[0].pageY - canvas.offsetTop;
  if (relativeX > 0 && relativeX < canvas.width && relativeY > 0 && relativey < canvas.height){
    play = true;
    paddlePos = relativeX - paddleWidth/2;
  } else {
    play = false;
  }
}

//function used to handle pressing an arrow key down
//the variable "e" stores the keydown event
//39 and 37 are the keycodes for the right and left arrow keys respectively
function keyDownHandler(e){
  if(e.keyCode == 39){
    rightPressed = true;
  } else if (e.keyCode == 37){
    leftPressed = true;
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

//checks for ball hitting brick
function collisionDetection(){
  for (var c=0; c < brickColumnCount; c++){                       //loops used to check each brick for each frame
    for (var r=0; r < brickRowCount; r++){
      var b = bricks[c][r];
      if(b.status == 1){                                          //makes sure status hasn't been changed to 0
        if (x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){ //checks if ball is inside brick
          dy = -dy;
          b.status = 0;                                           //sets brick status to 0 if brick was hit. brick doesn't render in next frame
          score++;
          if(score == brickRowCount * brickColumnCount){          //if score equals number of bricks, alerts a win
            alert("YOU WIN!!! CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+ score, 8, 20);                         //tells fillText what to write, and where to write it
}

function hideCursor (){
  document.getElementById("breakoutCanvas").style.cursor = "none";
}

draw();
