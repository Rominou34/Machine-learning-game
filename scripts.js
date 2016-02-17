
/*----- GAME FUNCTIONS -----*/

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = 1200;
var height = 600;

//DRAWING THE MAP
var drawMap = function() {
  ctx.clearRect(0,0,width, height);
  var xDef = (width/map.length/2);
  var yDef = (height/map[0].length/2);

  for(var x=0; x < map.length; x++) {
    for(var y=0; y < map[x].length; y++) {

        ctx.save();

        var xPos = x*(width/(map.length));
        var yPos = y*(height/(map[0].length));

        ctx.translate(xPos+xDef, yPos+yDef);
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI*2, true);
        if(map[x][y] == 0) {

        } else {
          switch(map[x][y]) {
            case 2:
              ctx.fillStyle = "#FFFF00";
              break;
            case 3:
              ctx.fillStyle = "#FF0000";
              break;
          }
          ctx.fill();
        }
        ctx.fillStyle = "#F00";

        ctx.closePath();

        ctx.restore();
    }
  }

  ctx.save();
  var playerX = player[0]*(width/(map.length));
  var playerY = player[1]*(height/(map[0].length));

  ctx.translate(playerX+xDef, playerY+yDef);
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI*2, true);

  ctx.fillStyle = "#0000FF";
  ctx.fill();
  ctx.closePath();

  ctx.restore();
}

/*--- GET PLAYER POSITION ---*/
var getPlayerPos = function() {
  for(var x=0; x < map.length; x++) {
    for(var y=0; y < map[x].length; y++) {
      if(map[x][y] == 1) {
        return [x,y];
      }
    }
  }
}

/*--- SET PLAYER POSITION ---*/
var setPlayerPos = function(x, y) {
  player = [x, y];
}

/*--- THE PLAYER DIES ---*/
var die = function() {
  console.log("The player died");
  log = [];
  player = [10, 10];
  fitness = 0;
  iterations++;
  //console.table(neurons);
  //console.table(moves);
  drawMap();
}

var win = function() {
  var message = document.querySelector("#messages");
  message.innerHTML += "The player won after " + iterations + " iterations<br/>";
  state=1;
  player = [10,10];
  banned_moves = [];
  mapLog = [];
  log = [];
  randomMap(25,25);
  victories++;
}

var getTreasurePos = function() {
  var pos;
  for(var i=0; i < map.length; i++) {
    for(var j=0; j < map[0].length; j++) {
      if(map[i][j] == 2) {
        pos = [i, j];
        break;
      }
    }
  }
  return pos;
}

/*--- TESTING THE ACTION ---*/
var caseValue = function(id, cont) {
  switch(cont) {
    case 0:
      return neurons[id].empty;
    case 2:
      return neurons[id].treasure;
    case 3:
      return neurons[id].enemy;
  }
}

/*--- GET THE VALUE OF THE DIRECTION ---*/
var getDirectionValue = function(dir, mov) {
  switch(mov) {
    case 0:
      return moves[dir].bottom;
    case 1:
      return moves[dir].right;
    case 2:
      return moves[dir].top;
    case 3:
      return moves[dir].left;
  }
}

/*--- GET THE TREASURE DIRECTION ---*/
var getDirection = function() {
  //Y superieur => en bas
  //X superieur => a droite
  var tre = getTreasurePos();
  var distX = tre[0]-player[0];
  var distY = tre[1]-player[1];
  var dir;

  if(distX > 0) { //Treasure on the right side
    if(distY > 0) { //Treasure on bot side
      if(distX > distY) { //Treasure on right
        dir = 1;
      } else { //Treasure on bot
        dir = 0;
      }
    } else { //Treasure on bot side
      if(Math.abs(distY) > distX) { //Treasure on top
        dir = 2;
      } else { //Treasure on right
        dir = 1;
      }
    }
  } else { //Treasure on the left side
    if(distY > 0) { //Treasure on the bot side
      if(Math.abs(distX) > distY) { //Treasure on the left
        dir = 3;
      } else { //Treasure on bot
        dir = 0;
      }
    } else { //Treasure on top side
      if(Math.abs(distX) > Math.abs(distY)) { //Treasure on left
        dir = 3;
      } else { //Treasure on top
        dir = 2;
      }
    }
  }
  return dir;
}

/*--- GET CASE CONTENT ---*/
var getCaseContent = function(i) {
  /*
    3
  4 X 2
    1
  */
  switch(i) {
    case 0:
      if(player[1]+1 < map[0].length) {
        return map[player[0]][player[1]+1];
      } else { return -2;}
    case 1:
      if(player[0]+1 < map.length) {
        return map[player[0]+1][player[1]];
      } else { return -2;}
    case 2:
      if(player[1]-1 >= 0) {
        return map[player[0]][player[1]-1];
      } else { return -2;}
    case 3:
      if(player[0]-1 >= 0) {
        return map[player[0]-1][player[1]];
      } else { return -2;}
  }
}

/*--- THE DECISION FUNCTION ---*/
var doSomething = function() {
  var bestAction = -1;
  var bestMove = -1;
  var moved=0;
  var direc = getDirection();
  old_distance = getDistance(getTreasurePos());
  for(var i=0; i < 4; i++) {
    //console.log("Checking move " + i + " value");
    var caseCont = getCaseContent(i);
    //console.log("Case content: " + caseCont);


    if(caseCont != -2) { //If we're not on the map border
      var actionValue = caseValue(i, caseCont);
      var directionValue = getDirectionValue(direc, i);
      if(actionValue == -1 || directionValue == -1) {
        move(i);
        getReward(i, direc, caseCont);
        moved=1;
        break;
      } else {
        var desti = getDestination(i);
        var passed = checkLogs(desti[0], desti[1]);
        var totalPass = checkMapLogs(desti[0], desti[1]);
        if((actionValue*directionValue) > bestAction && passed < 3 && totalPass < 100 && (notBannedCase(desti)==1)) {
          //console.log("Value: " + actionValue*directionValue);
          bestAction = (actionValue*directionValue);
          bestMove = i;

        } else {
          if(passed >= 3 || totalPass >= 10) {
            var newBan = getDestination(i);
            banned_moves.push(newBan);
            moved = 1;
            die();
          }
        }
      }
    }
  }
  if(moved == 0){
    if(bestAction > 0) {
      var conte = getCaseContent(bestMove);
      move(bestMove);
      getReward(bestMove, direc, conte);
      //checkState();
    } else {
      console.log("Stuck");
      banned_moves.push(player);
      die();
    }
  }
}

/*--- GETTING THE REWARD ---*/
var getReward = function(id, dir, cont) {
  var new_distance = getDistance(getTreasurePos());
  var moveValue;
  switch(cont) {
    case 0:
      if(neurons[id].empty == -1) {
        neurons[id].empty = 0.5;
      }
      break;
    case 2:
      if(neurons[id].treasure == -1) {
        neurons[id].treasure = 1;
      }
      break;
    case 3:
      if(neurons[id].enemy == -1) {
        neurons[id].enemy = 0;
      }
      break;
  }
  if(new_distance > old_distance) {
    moveValue = 1-Math.abs(new_distance-old_distance)/2;
  } else {
      moveValue = 1+Math.abs(new_distance-old_distance)/2;
  }
  switch(id) {
    case 0:
      if(moves[dir].bottom != -1) {
        moves[dir].bottom = ((moves[dir].bottom*mapLog.length) + moveValue)/(mapLog.length+1);
      } else {
        moves[dir].bottom = moveValue;
      }
      break;
    case 1:
      if(moves[dir].right != -1) {
        moves[dir].right = ((moves[dir].right*mapLog.length) + moveValue)/(mapLog.length+1);
      } else {
        moves[dir].right = moveValue;
      }
      break;
    case 2:
      if(moves[dir].top != -1) {
        moves[dir].top = ((moves[dir].top*mapLog.length) + moveValue)/(mapLog.length+1);
      } else {
        moves[dir].top = moveValue;
      }
      break;
    case 3:
      if(moves[dir].left != -1) {
        moves[dir].left = ((moves[dir].left*mapLog.length) + moveValue)/(mapLog.length+1);
      } else {
        moves[dir].left = moveValue;
      }
      break;
  }
  checkState();
}

/*--- CALCULATE THE DISTANCE ---*/
var getDistance = function(pos) {
  var distX = pos[0]-player[0];
  var distY = pos[1]-player[1];
  return Math.sqrt((distX*distX) + (distY*distY));
}

/*--- CHECK IF WE DIED / WON ---*/
var checkState = function() {
  if(map[player[0]][player[1]] == 3) {
    die();
  } else {
    if(map[player[0]][player[1]] == 2) {
      win();
    }
  }
}

/*--- CHECK THE LOGS ---*/
var checkLogs = function(x,y) {
  var totalPass=0;
  for(var i=0; i < log.length; i++) {
    if(log[i][0]== x && log[i][1] == y) {
      totalPass++;
    }
  }
  return totalPass;
}

/*--- CHECK THE MAP LOGS ---*/
var checkMapLogs = function(x,y) {
  var totalPass=0;
  for(var i=0; i < mapLog.length; i++) {
    if(mapLog[i][0] == x && mapLog[i][1] == y) {
      totalPass++;
    }
  }
  return totalPass;
}

var notBannedCase = function(x, y) {
  var ans = 1;
  for(var i=0; i < banned_moves.length; i++) {
    if(banned_moves[i][0] == x && banned_moves[i][1] == y) {
      ans=0;
    }
  }
  return ans;
}

var getDestination = function(i) {
  var dest;
  switch(i) {
    case 0:
      dest = [player[0], player[1]+1];
      break;
    case 1:
      dest = [player[0]+1, player[1]];
      break;
    case 2:
      dest = [player[0], player[1]-1];
      break;
    case 3:
      dest = [player[0]-1, player[1]];
      break;
    }
    return dest;
}

/*--- MOVING THE PLAYER ---*/
var move = function(i) {
  /*
    3
  4 X 2
    1
  */
  switch(i) {
    case 0:
      setPlayerPos(player[0], player[1]+1);
      break;
    case 1:
      setPlayerPos(player[0]+1, player[1]);
      break;
    case 2:
      setPlayerPos(player[0], player[1]-1);
      break;
    case 3:
      setPlayerPos(player[0]-1, player[1]);
      break;
  }
  drawMap();
  //map[player[0]][player[1]] = 0;
}


//GENERATES RANDOM MAPS
var randomMap = function(sizeX, sizeY) {
  map = [];
  var treCount = 0;
  var treX = 10;
  var treY = 10;
  while(treX == 10 || treY == 10) {
    treX = Math.round(Math.random()*24);
    treY = Math.round(Math.random()*24);
  }

  for(var x=0; x < sizeX; x++) {
    var ligne = [];
    var enCount = 0;
    for(var y=0; y < sizeY; y++) {
      if(x!=treX || y!=treY) {
        if(x!=10 || y!=10) {
          if(Math.random()<0.05) {
            ligne.push(3);
            enCount++;
          } else {
            ligne.push(0);
          }
        } else {
            ligne.push(0);
          }
        }
      }
    map.push(ligne);
  }
  map[treX][treY] = 2;
}
//CHECKS THE KNOWLEDGE OF THE BOT
var checkKnowledge = function() {
  var errors = 0;
  for(var i=0; i < neurons.length; i++) {
    if(neurons[i].empty == -1) { errors++; }
    if(neurons[i].enemy == -1) { errors++; }
    if(neurons[i].treasure == -1) { errors++; }
  }
  for(var j=0; j < moves.length; j++) {
    if(moves[j].left == -1) { errors++; }
    if(moves[j].right == -1) { errors++; }
    if(moves[j].top == -1) { errors++; }
    if(moves[j].bottom == -1) { errors++; }
  }
  return errors;
}

var counter = document.querySelector("#counter");

var iterate = function() {
  log.push([player[0], player[1]]);
  mapLog.push([player[0], player[1]]);
  //console.log(banned_moves);
  doSomething();
  fitness++;
  errors = checkKnowledge();
  console.log("Errors: " + errors);
  //drawMap();
  counter.innerHTML = "Iterations: " + iterations + "<br/>Fitness: " + fitness +
  "<br/>Generations: " + (victories+1) + "<br/>Untrained neurons: " + errors;
  displayNeurons();
  displayMoves();
  //console.table(neurons);
  //console.table(moves);
  if(errors <= 0) {
    clearInterval(interv);
  }
}

var displayNeurons = function() {
  var neuronDiv = document.querySelector("#neurons");
  neuronDiv.innerHTML = "";
  for(var i=0; i < neurons.length; i++) {
    neuronDiv.innerHTML += "{ id: " + neurons[i].id + ", empty: " + neurons[i].empty + ", enemy: " + neurons[i].enemy +
    ", treasure: " + neurons[i].treasure + " }<br/>";
  }
}

var displayMoves = function() {
  var moveDiv = document.querySelector("#moves");
  moveDiv.innerHTML = "";
  for(var i=0; i < moves.length; i++) {
    moveDiv.innerHTML += "{ id: " + moves[i].id + ", top: " + moves[i].top + ", right: " + moves[i].right +
    ", bottom: " + moves[i].bottom + ", left: " + moves[i].left + " }<br/>";
  }
}

var run = function() {
  state=1;
  randomMap(25,25);
  banned_moves = [];
  interv = setInterval(iterate, 250);
}

window.onload = function() {
  drawMap();
  run();
}
