
/*----- INITIALIZATION VARIABLES -----*/

// 1 = ALIVE, 0 = DEAD
var state;
var interv;
var victories=0;
var errors;

/*
1: PLAYER
2: TREASURE
3: ENEMY
*/
var player = [10,10];
var iterations=1;
var fitness = 0;

var old_distance = 0;

//The log saves all the moves made on this map
var log = [];

var mapLog = [];

//We ban the moves which make us stuck
var banned_moves = [];

var map = [
  [0,2,0,0,0,3],
  [0,0,3,0,3,0],
  [0,3,0,0,0,3],
  [3,0,0,0,0,0],
  [0,0,0,0,3,0]
];

//ALL NEURONS INITIALIZED AT ZERO BECAUSE THE PROGRAM KNOWS NOTHING AT THE BEGINNING

//The neurons which detect the cases next to the player
//0 = BOTTOM - 1 = RIGHT - 2 = TOP - 3 = LEFT
var neurons = [
  { id: 0, empty: -1, wall: -1, enemy: -1, treasure: -1},
  { id: 1, empty: -1, wall: -1, enemy: -1, treasure: -1},
  { id: 2, empty: -1, wall: -1, enemy: -1, treasure: -1},
  { id: 3, empty: -1, wall: -1, enemy: -1, treasure: -1},
];

//The neurons that detect the treasure's position
//0 = BOTTOM - 1 = RIGHT - 2 = TOP - 3 = LEFT
var moves = [
  {id: 0, top: -1, right: -1, bottom: -1, left: -1},
  {id: 1, top: -1, right: -1, bottom: -1, left: -1},
  {id: 2, top: -1, right: -1, bottom: -1, left: -1},
  {id: 3, top: -1, right: -1, bottom: -1, left: -1}
];
