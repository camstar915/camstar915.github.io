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

//function used to render images
function draw(){
  ctx.clearRect(0,0,canvas.width, canvas.height); //clears canvas before new frame
  drawBall();
  drawPaddle();
  x += dx;                                        //updates axis value (moves ball)
  y += dy;

  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius){     //changes ball direction if hits left or right
    dx = -dx;
  };

  if(y + dy > canvas.height-ballRadius || y + dy < ballRadius){    //changes ball direction if hits top or bottom
    dy = -dy;
  };

  if(leftPressed && paddlePos >= 0){                               //moves paddle within canvas based on key up/down events
    paddlePos -= paddleSpeed;
  } else if (rightPressed && paddlePos <= canvas.width-paddleWidth){
    paddlePos += paddleSpeed;
  };

};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

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

setInterval(draw,10);                             //runs draw function every 10 miliseconds



/*
ctx.beginPath();
ctx.rect(20,40,50,50);
ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.arc(240,160,20,0, Math.PI*2, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.rect(160,10,100,40);
ctx.strokeStyle = "rgba(0,0,255,0.5)"
ctx.stroke();
ctx.closePath();
*/
