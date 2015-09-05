
canvas = document.getElementById("the-arena");
context = canvas.getContext("2d");

canvas.width  = 1200;
canvas.height = 530;

//For debugging - cuz I don't wanna use Firebug
function log(msg) {
    setTimeout(function() {
        throw new Error(msg);
    }, 0);
}

//Game controls
KEYS = {
  up: [38, 87], //up, w
  down: [40, 83], //down, s
  left: [37, 65],//left, a
  right: [39, 68], //right, d
};

oppositeDirection = {
  'up': 'down',
  'left': 'right',
  'right': 'left',
  'down': 'up'
};

lastKey = null;

matrix = [];
for(var i=0; i<canvas.width; i++) {
    matrix[i] = [];
    for(var j=0; j<canvas.height; j++) {
        matrix[i][j] = false;
    }
}

GAME = {
  
  over: false,
  
  start: function() {
    player = new CYCLE.makeRider('user');
    program = new CYCLE.makeRider('program');
    CYCLE.resetRider(player);
    CYCLE.resetRider(program);
  },

  stop: function(rider){
    GAME.over = true;
    loser = rider.type;
    if (loser == 'user'){
      winner = 'program';
    }
    else {
      winner = 'user';
    }
    context.fillStyle = '#00FF00';
    context.font = "bold";
    context.font = (canvas.height / 15) + 'px sans-serif';
    context.textAlign = 'center';
    context.fillText('GAME OVER: ' + winner + ' wins!', canvas.width / 2, canvas.height / 2);
  },
  
  resetCanvas: function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  
};

CYCLE = {
  //Rider constructor
  makeRider: function(type){
    //Default for all riders
    this.width = 10;
    this.height = 10;
    this.history = [];

    this.type = type;
    if (type == "user"){
      this.color = '#6FC3DF'; 
      this.current_direction = "left";
      log("Made");
    }
    else if (type =="program"){
      this.color = "#FFE64D";
      this.current_direction = "right";
    }
    else {
      log("Invalid rider type");
    }
  },
  
  resetRider: function(rider) {
    if (rider.type == "user"){
      rider.x = canvas.width - (canvas.width / (rider.width / 2) + 4) - 6;
      rider.y = (canvas.height / 2) + (rider.height / 2);   
      rider.current_direction = "left";      
    }
    else if (rider.type = "program"){
      rider.x = (canvas.width / (rider.width / 2) - 4) - 6;
      rider.y = (canvas.height / 2) + (rider.height / 2);   
      rider.current_direction = "right";
    }
  },
  
  move: function(rider) {
    if (rider.type == 'program' && Math.ceil(Math.random() * 10) >= 8){
      this.moveProgram(rider);
    }
    switch(rider.current_direction) {
      case 'up':
        rider.y -= rider.height;
        break;
      case 'down':
        rider.y += rider.height;
        break;
      case 'right':
        rider.x += rider.width;
        break;
      case 'left':
        rider.x -= rider.width;
        break;
    }
    if (this.isCollision(rider.x, rider.y)){
      GAME.stop(rider);
    }
    rider.history.push(this.generateCoords(rider));
  },

  moveProgram: function(rider){
    bestMove = this.programPing(rider).best;
    rider.current_direction = bestMove;
  },

  programPing: function(rider){
    pong = {
      up: 0,
      down: 0,
      left: 0,
      right: 0
    };
    // Up
    for (i = rider.y - rider.height; i>= 0; i -= rider.height) {
      pong.up = rider.y - i - rider.width;
      if (this.isCollision(rider.x, i)) break;
    }
    // Down
    for (i = rider.y + rider.height; i<= canvas.height; i += rider.height) {
      pong.down = i - rider.y - rider.width;
      if (this.isCollision(rider.x, i)) break;
    }
    // Left
    for (i = rider.x - rider.width; i>= 0; i -= rider.width) {
      pong.left = rider.x - i - rider.width;
      if (this.isCollision(i, rider.y)) break;
    }
    // Right
    for (i = rider.x + rider.width; i<= canvas.width; i += rider.width) {
      pong.right = i - rider.x - rider.width;
      if (this.isCollision(i, rider.y)) break;
    }
    var largest = {
      key: null,
      value: 0
    };
    for(var j in pong){
        if( pong[j] > largest.value ){
            largest.key = j;
            largest.value = pong[j];
        }
    }
    pong.best = largest.key;
    return pong;
  },
  
  generateCoords: function(rider) {
    return rider.x + "," + rider.y;
  },
  
  draw: function(rider) {
    context.fillStyle = rider.color;
    context.beginPath();
    context.moveTo(rider.x - (rider.width / 2), rider.y - (rider.height / 2));
    context.lineTo(rider.x + (rider.width / 2), rider.y - (rider.height / 2));
    context.lineTo(rider.x + (rider.width / 2), rider.y + (rider.height / 2));
    context.lineTo(rider.x - (rider.width / 2), rider.y + (rider.height / 2));
    context.closePath();
    context.fill();
  },

  getOpponent: function(rider){
    if (rider.type == "user"){
      return program; //BAD, returning global
    }
    else if (rider.type == "program"){
      return user;
    }
    else{
      log("That ain't no user you be passing in getOpponenet!")
    }
  },

  isCollision: function(x,y) {
    if (
        x < (program.width / 2) || 
        x > canvas.width - (program.width / 2) || 
        y < (program.height / 2) || 
        y > canvas.height - (program.height / 2) ||
        program.history.indexOf(x + "," + y) >= 0 || 
        player.history.indexOf(x + "," + y) >= 0) {
      return true;
    }
  return false;
  }     
};

Object.prototype.getKey = function(value){
  for(var key in this){
    if(this[key] instanceof Array && this[key].indexOf(value) >= 0){
      return key;
    }
  }
  return null;
};

addEventListener("keydown", function (e) {
    lastKey = KEYS.getKey(e.keyCode);
    if (Object.prototype.hasOwnProperty.call(KEYS, lastKey) && (lastKey != oppositeDirection[player.current_direction])) {
      player.current_direction = lastKey;
    }
}, false);


loop = function() {
  if (GAME.over === false) {
    CYCLE.move(player);
    CYCLE.draw(player);
    CYCLE.move(program);
    CYCLE.draw(program);

  }
};

main = function() {
  GAME.start();
  setInterval(loop, 50);  
}();