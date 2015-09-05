canvas = document.getElementById("the-game-arena");

context = canvas.getContext("2d"); //returns an object that provides methods and properties for drawing on the canvas

//http://www.colourlovers.com/palette/1406402/Tron_Legacy_2

PLAYER = {
  type: 'program',
  x: null,
  y: null,
}


//Computer player (randomish)
PROGRAM = {
  type: 'program',
  width: 8,
  height: 8,
  color: '#FFE64D',
  trail: [],
  current_direction: null
};

//Human player
USER = {
  type: 'user',
  width: 8,
  height: 8,
  color: '#6FC3DF',
  trail: [],
  current_direction: "right"
};

//Game controls
KEYS = {
  up: [38, 87], //up, w
  down: [40, 83], //down, s
  left: [37, 65],//left, a
  right: [39, 68], //right, d
  start_game: [13, 32] //tab, space
};

//Handles game mechanics
GAME = {
  fps: 8,
  over: false,
  message: null,

  start: function(){
    over = false;
    CYCLE.initUser();
    CYCLE.initProgram();
  },

  stop: function(){
    over = true;
  }

};

Handles game movements by drawing on canvas
CYCLE = {
  move: function(){}
}

main = function(){
  cycle.y -= cycle.height;

}(); //autonymous fn