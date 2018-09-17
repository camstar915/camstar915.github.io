var canvas = document.getElementById("minesweeperCanvas");
var ctx = canvas.getContext("2d");
var newGameButton = document.getElementById("newGameButton");
var scoreboard = document.getElementById("scoreboardMS");
var scoreText = document.getElementsByClassName("score");
document.cookie = "bestTime=1000; expires=Sun, 15 Sept 2020 00:00:00 UTC";

newGameButton.style.visibility = "hidden";

var squareSize = 50;
var squareHeight = squareSize;
var squareWidth = squareSize;
var squareRows = 10;
var squareColumns = 10;
var squarePadding = squareSize/20;
var colorCovered = "white";
var colorUncovered = "#26BBBF";
var colorMarked = "#727777"
var bombNumber = 20;
var numberShown = 0;
var numberMarked = 0;
var timeCount = 0;
var longPressDelay = 500;

function hello(){
  console.log("hello");
}

document.getElementById("scoreboardMS").style.fontSize = scoreboardMS.height + "px";

function printBestTime(){
  document.getElementById("bestTime").innerHTML = "Cookie: " + getCookie(bestTime);
}

function printBombs(){
  document.getElementById("printBombs").innerHTML = "Bombs: " + bombNumber;
}

function printMarked(){
  document.getElementById("printMarked").innerHTML = "Marked: " + numberMarked;
}

var time = setInterval(runTime, 1000);

function printTime(){
  document.getElementById("printTime").innerHTML = "Time: " + timeCount;
}

function getCookie(name) {
    var b = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

var timeGo = false;
function runTime(){
  if (timeGo){
    timeCount++;
    printTime();
  }
}

function stopTime(){
  clearInterval(time);
}

canvas.width = squareWidth*squareColumns + squareColumns*squarePadding + squarePadding;
canvas.height = squareHeight*squareRows + squareRows*squarePadding + squarePadding;

if (screen.width<canvas.width){
  var nSquares = squareRows*squareColumns;
  var newWidth = Math.floor((screen.width/squareWidth)-1);
  squareColumns = newWidth;
  squareRows = Math.floor(nSquares/newWidth);
  canvas.width = squareWidth*squareColumns + squareColumns*squarePadding + squarePadding;
  canvas.height = squareHeight*squareRows + squareRows*squarePadding + squarePadding;
}

var canvasWidth = canvas.width;
scoreboard.style.width = canvasWidth+squarePadding + "px";

//build square array
var sq = [];
for (var r=0; r<squareRows; r++){
  sq[r] = [];
  for(var c=0; c<squareColumns; c++){
    sq[r][c] = {
      x:0,
      y:0,
      isShown:false,
      isMarked:false,
      isBomb:false,
      bombsNear:0
    }
  }
}

function randNum(min, max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

function placeBombs(){
  for (b=0; b<bombNumber; b++){
    var y = randNum(0,squareRows-1);
    var z = randNum(0,squareColumns-1);
    if (sq[y][z].isBomb){
      b--;
    } else {
      sq[y][z].isBomb = true;
      sq[y][z].bombsNear = "B";
    }
  }
}

function checkForBombs (r,c){
  var square = sq[r][c];
  if (r>0 && r<squareRows-1 && c>0 && c<squareColumns-1){
    if (sq[r-1][c-1].isBomb){
      square.bombsNear++;
    }
    if (sq[r-1][c].isBomb){
      square.bombsNear++;
    }
    if (sq[r-1][c+1].isBomb){
      square.bombsNear++;
    }
    if (sq[r][c-1].isBomb){
      square.bombsNear++;
    }
    if (sq[r][c+1].isBomb){
      square.bombsNear++;
    }
    if (sq[r+1][c-1].isBomb){
      square.bombsNear++;
    }
    if (sq[r+1][c].isBomb){
      square.bombsNear++;
    }
    if (sq[r+1][c+1].isBomb){
      square.bombsNear++;
    }
  } else if (c>0 && c<squareColumns-1 && r>0){
    if (sq[r-1][c-1].isBomb){
      square.bombsNear++;
    }
    if (sq[r-1][c].isBomb){
      square.bombsNear++;
    }
    if (sq[r-1][c+1].isBomb){
      square.bombsNear++;
    }
    if (sq[r][c-1].isBomb){
      square.bombsNear++;
    }
    if (sq[r][c+1].isBomb){
      square.bombsNear++;
    }
  } else if (r>0 && r<squareRows-1 && c>0){
    if (sq[r-1][c-1].isBomb){
      square.bombsNear++;
    }
    if (sq[r-1][c].isBomb){
      square.bombsNear++;
    }
    if (sq[r][c-1].isBomb){
      square.bombsNear++;
    }
    if (sq[r+1][c-1].isBomb){
      square.bombsNear++;
    }
    if (sq[r+1][c].isBomb){
      square.bombsNear++;
    }
  } else if (c>0 && c<squareColumns-1){
    if (sq[r][c-1].isBomb){
      square.bombsNear++;
    }
    if (sq[r][c+1].isBomb){
      square.bombsNear++;
    }
    if (sq[r+1][c-1].isBomb){
      square.bombsNear++;
    }
    if (sq[r+1][c].isBomb){
      square.bombsNear++;
    }
    if (sq[r+1][c+1].isBomb){
      square.bombsNear++;
    }
  } else if (r>0 && r<squareRows-1){
    if (sq[r-1][c].isBomb){
      square.bombsNear++;
    }
    if (sq[r-1][c+1].isBomb){
      square.bombsNear++;
    }
    if (sq[r][c+1].isBomb){
      square.bombsNear++;
    }
    if (sq[r+1][c].isBomb){
      square.bombsNear++;
    }
    if (sq[r+1][c+1].isBomb){
      square.bombsNear++;
    }
  } else if (r<squareRows-1 && c<squareColumns-1){
    if (sq[r][c+1].isBomb){
      square.bombsNear++;
    }
    if (sq[r+1][c].isBomb){
      square.bombsNear++;
    }
    if (sq[r+1][c+1].isBomb){
      square.bombsNear++;
    }
  } else if (r>0 && c<squareColumns-1){
    if (sq[r-1][c].isBomb){
      square.bombsNear++;
    }
    if (sq[r-1][c+1].isBomb){
      square.bombsNear++;
    }
    if (sq[r][c+1].isBomb){
      square.bombsNear++;
    }
  } else if (r>0 && c>0){
    if (sq[r-1][c-1].isBomb){
      square.bombsNear++;
    }
    if (sq[r-1][c].isBomb){
      square.bombsNear++;
    }
    if (sq[r][c-1].isBomb){
      square.bombsNear++;
    }
  } else if (c>0 && r<squareRows-1){
    if (sq[r][c-1].isBomb){
      square.bombsNear++;
    }
    if (sq[r+1][c-1].isBomb){
      square.bombsNear++;
    }
    if (sq[r+1][c].isBomb){
      square.bombsNear++;
    }
  }
}

function drawNear(r,c){
  var box = sq[r][c];
  ctx.font = (squareSize/2)+"px Arial";
  ctx.fillStyle = "#727777";
  ctx.fillText(box.bombsNear, box.x+((squareSize/2)/1.4), box.y+((squareSize/2))*1.3)
}

function drawBomb (r,c){
  var box = sq[r][c];
  ctx.font = (squareSize/2)+"px Arial";
  ctx.fillStyle = "#26BBBF";
  ctx.fillText(box.bombsNear, box.x+((squareSize/2)/1.4), box.y+((squareSize/2))*1.3)
}

function showBombs(){
  for (r=0; r<squareRows; r++){
    for (c=0; c<squareColumns; c++){
      if (sq[r][c].isBomb){
        drawBomb(r,c);
      }
    }
  }
}

function drawSquares() {
  for (r=0; r<squareRows; r++){
    for (c=0; c<squareColumns; c++){
      sq[r][c].x = (c*(squareWidth + squarePadding)) + squarePadding;
      sq[r][c].y = (r*(squareHeight + squarePadding)) + squarePadding;
      ctx.beginPath();
      ctx.rect(sq[r][c].x, sq[r][c].y, squareWidth, squareHeight);
      ctx.closePath();
      if (sq[r][c].isMarked == true){
        ctx.fillStyle = colorMarked;
        ctx.fill();
      } else if (sq[r][c].isShown == false){
        ctx.fillStyle = colorCovered;
        ctx.fill();
      } else {
        ctx.fillStyle = colorUncovered;
        ctx.fill();
        drawNear(r,c);
      }
    }
  }
  printMarked();
}

function setMarked(r,c){
  if (sq[r][c].isMarked == true){
    disableClick();
    sq[r][c].isMarked = false;
    numberMarked--;
    drawSquares();
    setTimeout(enableClick, 100)
  } else {
    sq[r][c].isMarked = true;
    numberMarked++;
    drawSquares();
  }
}

function drawGame(){
  printBestTime();
  drawSquares();
  placeBombs();
  printBombs();
  enableClick();
  printTime();
}

function enableClick(){
canvas.addEventListener("mouseup", clickHandler, false);
canvas.addEventListener("touchstart", touchHandler, false);
}

function disableClick(){
  canvas.removeEventListener("mouseup", clickHandler, false);
  canvas.removeEventListener("touchstart", touchHandler, false);
}

function touchHandler(e){
  canvas.addEventListener("touchend", touchEndHandler, false);
  var timer = 0;
  var relativeX = e.touches[0].pageX - canvas.offsetLeft;
  var relativeY = e.touches[0].pageY - canvas.offsetTop;
  for (r=0; r<squareRows; r++){
    for  (c=0; c<squareColumns; c++){
      if (relativeX > sq[r][c].x && relativeX < sq[r][c].x+squareSize && relativeY > sq[r][c].y && relativeY < sq[r][c].y+squareSize) {
        timer = setTimeout(setMarked.bind(null,r,c), longPressDelay);
      }
    }
  }
  function touchEndHandler(){
    if (timer){
      clearTimeout(timer);
    }
  }
}

function clickHandler(e){
  timeGo = true;
  var relativeX = e.pageX - canvas.offsetLeft;
  var relativeY = e.pageY - canvas.offsetTop;
  for (r=0; r<squareRows; r++){
    for (c=0; c<squareColumns; c++){
      if (relativeX > sq[r][c].x && relativeX < sq[r][c].x+squareSize && relativeY > sq[r][c].y && relativeY < sq[r][c].y+squareSize) {
        if (event.which == 1){
          if (sq[r][c].isBomb){
              if (sq[r][c].isMarked == true){
                return;
              }
            timeGo = false;
            showBombs();
            disableClick();
            newGameButton.style.visibility = "visible";
          } else if (sq[r][c].isShown == false){
              if (sq[r][c].isMarked == true){
                return
              }
            sq[r][c].isShown = true;
            numberShown++;
            if (numberShown >= (squareRows*squareColumns)-bombNumber){
              timeGo = false;
              if (getCookie(bestTime)<timeCount){
                document.cookie = "bestTime=" + timeCount + "; expires=Sun, 15 Sept 2019 00:00:00 UTC";
              }
              checkForBombs(r,c);
              drawSquares();
              showBombs();
              disableClick();
              newGameButton.style.visibility = "visible";
            }
            checkForBombs(r,c);
            drawSquares();
          }
        } else if (event.which == 3){
          if (!sq[r][c].isShown){
            setMarked(r,c);
          }
        }
      }
    }
  }
}

function newGame(){
  newGameButton.style.visibility = "hidden";
  for (r=0; r<squareRows; r++){
    for (c=0; c<squareColumns; c++){
      sq[r][c].isShown = false;
      sq[r][c].isBomb = false;
      sq[r][c].isMarked = false;
      sq[r][c].bombsNear = 0;
    }
    numberShown = 0;
    numberMarked = 0;
    timeCount = 0;
  }
  drawGame();
}

drawGame();
