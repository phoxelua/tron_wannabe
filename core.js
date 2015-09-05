
canvas = document.getElementById("the-game");
context = canvas.getContext("2d");

player = {
  type: 'user',
  width: 8,
  height: 8,
  color: '#58BEFF',
  history: [],
  current_direction: null
};

keys = {
  up: [38, 87],
  down: [40, 83],
  left: [37, 65],
  right: [39, 68],
  start_game: [13, 32]
};

lastKey = null;

game = {
  
  over: false,
  
  start: function() {
    cycle.resetPlayer();
    game.over = false;
    player.current_direction = "left";
    game.resetCanvas();
  },
  
  resetCanvas: function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  
};

cycle = {
  
  resetPlayer: function() {
    player.x = canvas.width - (canvas.width / (player.width / 2) + 4);
    player.y = (canvas.height / 2) + (player.height / 2);
    player.color = '#58BEFF';
    player.history = [];    
    player.current_direction = "left";
  },
  
  move: function(cycle) {
    switch(cycle.current_direction) {
      case 'up':
        cycle.y -= cycle.height;
        break;
      case 'down':
        cycle.y += cycle.height;
        break;
      case 'right':
        cycle.x += cycle.width;
        break;
      case 'left':
        cycle.x -= cycle.width;
        break;
    }
    coords = this.generateCoords(cycle);
    cycle.history.push(coords);
  },
  
  generateCoords: function(cycle) {
    return cycle.x + "," + cycle.y;
  },
  
  draw: function(cycle) {
    context.fillStyle = cycle.color;
    context.beginPath();
    context.moveTo(cycle.x - (cycle.width / 2), cycle.y - (cycle.height / 2));
    context.lineTo(cycle.x + (cycle.width / 2), cycle.y - (cycle.height / 2));
    context.lineTo(cycle.x + (cycle.width / 2), cycle.y + (cycle.height / 2));
    context.lineTo(cycle.x - (cycle.width / 2), cycle.y + (cycle.height / 2));
    context.closePath();
    context.fill();
  }
  
};

inverseDirection = function() {
  switch(player.current_direction) {
    case 'up':
      return 'down';
      break;
    case 'down':
      return 'up';
      break;
    case 'right':
      return 'left';
      break;
    case 'left':
      return 'right';
      break;
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
    lastKey = keys.getKey(e.keyCode);
    if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0  && lastKey != inverseDirection()) {
      player.current_direction = lastKey;
    } else if (['start_game'].indexOf(lastKey) >= 0  && game.over) {
      game.start();
    }
}, false);

loop = function() {
  if (game.over === false) {
    cycle.move(player);
    cycle.draw(player);
  }
};

main = function() {
  game.start();
  setInterval(loop, 100);  
}();