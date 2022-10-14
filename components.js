/* ===== CHARGEMENT DES DIFFERENTS SONS DU JEU ===== */
const WALL_HIT = new Audio('sounds/wall.mp3');
const PADDLE_HIT = new Audio('sounds/paddle_hit.mp3');
const LIFE_LOST = new Audio('sounds/life_lost.mp3');
const WIN = new Audio('sounds/win.mp3');
const BRICK_HIT = new Audio('sounds/brick_hit.mp3' );

/* ==== CHARGEMENT DES IMAGES ==== */
const LEVEL_IMG = new Image();
LEVEL_IMG.src = 'img/level.png';
const LIFE_IMG = new Image();
LIFE_IMG.src = 'img/life.png';
const SCORE_IMG = new Image();
SCORE_IMG.src = 'img/score.png';
const YELLOW_BRICK_IMG = new Image();
YELLOW_BRICK_IMG.src = 'img/YellowBrick.png';
const GREEN_BRICK_IMG = new Image();
GREEN_BRICK_IMG.src = 'img/GreenBrick.png';
const BACKGROUND_IMG = new Image();
BACKGROUND_IMG.src = 'img/Background-img.png';
const PADDLE_IMG = new Image();
PADDLE_IMG.src = 'img/paddle-img.png';
const BALL_IMG = new Image();
BALL_IMG.src = 'img/ball-img.png';