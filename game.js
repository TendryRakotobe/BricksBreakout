// Initialisation du canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.style.border = '1px solid #fff';
canvas.style.backgroundColor = '#111';
ctx.lineWidth = 1;

//Importation des éléments du DOM
const rules = document.getElementById('rules');
const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const game_over = document.getElementById('game-over');
const youWon = document.getElementById('you-won');
const youLose = document.getElementById('you-lose');
const restart = document.getElementById('restart');

//Affichage des règles du jeu

rulesBtn.addEventListener('click', () => {
    rules.classList.add('show');
    isPaused = true;
});
closeBtn.addEventListener('click', () => {
    rules.classList.remove('show');
    isPaused = false;
});



//variables nécessaires
let leftArrow = false;
let rightArrow = false;
let gameOver = false;
let isPaused = false;
let life = 2;
let score = 0;
let level = 1;

//Pause
document.addEventListener('keydown', (e) => {
    if(e.key === 'p'){
        console.log(isPaused);
        isPaused = !isPaused;
    }
});

//ajouter life
document.addEventListener('keydown', (e) =>{
    if(e.key === 'i'){
    life += 1;
    }
});
//ajouter level
document.addEventListener('keydown', (e) =>{
    if(e.key === 'n'){
    level += 1;
    }
});

//Constantes nécessaires
const PADDLE_WIDTH = 88.8;
const PADDLE_MARGIN_BOTTOM = 10;
const PADDLE_HEIGHT = 19.2;
const BALL_RADIUS = 7;
const SCORE_UNIT = 10;
const MAX_LEVEL = 3;

//Afficher les statistiques du jeu
function showStats(img, iPosX, iPosY, text = '', tPosX = null, tPosY = null ){
    ctx.fillStyle = "#6198d8";
    ctx.font = '2Opx ';
    ctx.fillText(text, tPosX, tPosY);
    ctx.drawImage(img, iPosX, iPosY, width = 20, height = 20);
}

function gameover(){
    if(life <= 0){
        showEndInfo('lose');
        gameOver = true;
    }
}

function nextLevel(){
    let isLevelUp = true;

    for (let r = 0; r < brickProp.row; r++){
        for (let c = 0; c < brickProp.column; c++){
            isLevelUp = isLevelUp && !yellowBricks[r][c].status;
        }
    }

    if(isLevelUp){
        WIN.play();
        if(level >= MAX_LEVEL){
            showEndInfo();
            gameOver = true;
            return;
        }

        createYellowBricks();
        createGreenBricks();
        ball.velocity += .5;
        resetBall();
        resetPaddle();
        level++;
    }
}

//Propriétés de la planche 
const paddle = {
    x: (canvas.width / 2) - (PADDLE_WIDTH / 2),
    y: canvas.height - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM ,
    w: PADDLE_WIDTH, 
    h: PADDLE_HEIGHT,
    dx:8
}

//Dessiner la planche
function drawPaddle(){
    
    ctx.beginPath();
    ctx.drawImage(PADDLE_IMG, paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.closePath();
}

function resetPaddle(){
    paddle.x = (canvas.width / 2) - (PADDLE_WIDTH / 2);
    paddle.y = canvas.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT;
}

//Propriétés de la balle
const ball = {
    x: canvas.width / 2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    velocity: 7,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3
}

//Dessiner la balle
function drawBall(){
    ctx.beginPath; 
    ctx.drawImage(BALL_IMG, ball.x, ball.y, 15, 15);
    ctx.closePath();
    
    
}

//Mouvement de la balle
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

//Intéraction de la balle & mur
function bmCollision(){

    //collision sur les axes des X
    if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0)  {
        WALL_HIT.play();
        ball.dx *= -1;
    }

    //collision sur les axes des Y
    if(ball.y - ball.radius < 0){
        WALL_HIT.play();
        ball.dy *= -1;
    }
    //game over
    if(ball.y + ball.radius > canvas.height) {
        LIFE_LOST.play();
        life--;
        resetBall();
        resetPaddle();
    }
}

function resetBall(){
    ball.x = canvas.width / 2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;

}

//Propriétés des briques
const brickProp = {
    row : 4,
    column : 11,
    w : 40,
    h : 20,
    padding : 0,
    offsetX : 55,
    offsetY : 40,
    fillColor :'#6198d8',
    visible : true,
}

//Création des briques jaunes
let yellowBricks = [];
function createYellowBricks(){
    for (let r = 0; r < brickProp.row; r++){
        yellowBricks[r] = [];
    
        for (let c = 0; c < brickProp.column; c++){
        yellowBricks[r][c] = {
            x: c * (brickProp.w + brickProp.padding) + brickProp.offsetX,
            y: r * (brickProp.h + brickProp.padding) + brickProp.offsetY,
            status : true,
            ...brickProp
        }
    }
    }
}

createYellowBricks();



//Dessiner les briques jaunes
function drawYellowBricks(){
    yellowBricks.forEach(column => {
        column.forEach(yellowBrick => {
            if (yellowBrick.status) {
               ctx.drawImage(YELLOW_BRICK_IMG, yellowBrick.x, yellowBrick.y, yellowBrick.w, yellowBrick.h);
            }
        })
    })
}
//Collision balle et briques jaunes
function bybCollision(){
    yellowBricks.forEach(column => {
        column.forEach(yellowBrick => {
            if(yellowBrick.status){
            
                if(ball.x + ball.radius > yellowBrick.x + 5 && 
                ball.x - ball.radius < yellowBrick.x + yellowBrick.w - 5 &&
                ball.y + ball.radius > yellowBrick.y  && 
                ball.y - ball.radius < yellowBrick.y + yellowBrick.h  ){
                    BRICK_HIT.play();
                    ball.dy *= -1;
                    yellowBrick.status = false;
                    score += SCORE_UNIT;
                  }
            }
        })
    })

}
//Création des briques vertes
let greenBricks = [];
function createGreenBricks(){
    for (let r = 0; r < brickProp.row; r++){
        greenBricks[r] = [];
    
        for (let c = 0; c < brickProp.column; c++){
        greenBricks[r][c] = {
            x: c * (brickProp.w + brickProp.padding) + brickProp.offsetX,
            y: r * (brickProp.h + brickProp.padding) + brickProp.offsetY,
            status : true,
            ...brickProp
        }
    }
    }
}

createGreenBricks();
//Dessiner les briques vertes
function drawGreenBricks(){
    greenBricks.forEach(column => {
        column.forEach(greenBrick => {
            if (greenBrick.status) {
               ctx.drawImage(GREEN_BRICK_IMG, greenBrick.x, greenBrick.y, greenBrick.w, greenBrick.h);
            }
        })
    })
}


//Collision balle et briques vertes
function bgbCollision(){
    greenBricks.forEach(column => {
        column.forEach(greenBrick => {
            if(greenBrick.status){
            
                if(ball.x > greenBrick.x - 20&& 
                ball.x  < greenBrick.x + greenBrick.w + 20 &&
                ball.y  > greenBrick.y - 10 && 
                ball.y  < greenBrick.y + greenBrick.h + 10 ){
                    BRICK_HIT.play();
                    ball.dy *= -1;
                    greenBrick.status = false;
                    score += SCORE_UNIT;
                  }
            }
        })
    })

}

//Intéraction de la balle & la planche
function bpCollision(){
    if (ball.x > paddle.x && 
        ball.x < paddle.x + paddle.w && 
        ball.y > paddle.y)
    {
        PADDLE_HIT.play();
        let collidePoint = ball.x - (paddle.x + paddle.w / 2);
  
        collidePoint = collidePoint / (paddle.w / 2);
        console.log(collidePoint);
        let angle = collidePoint * Math.PI/3;


        ball.dx = ball.velocity * Math.sin(angle);
        ball.dy = - ball.velocity * Math.cos(angle);
    }
}

//Mise en place des touches de contrôle de la planche
document.addEventListener('keydown', (e) => {
    console.log(e.key);
    if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftArrow = true;
        
    } else if (e.key === 'Right' || e.key === 'ArrowRight'){
        rightArrow = true;
    }
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'Left' || e.key ==='ArrowLeft') {
        leftArrow = false;
    } else if (e.key === 'Right' || e.key === 'ArrowRight'){
        rightArrow = false;
    }
});

//Animation de la planche
function movePaddle() {
    if(leftArrow && paddle.x > -5) {
        paddle.x -= paddle.dx;
    } else if (rightArrow && (paddle.x + paddle.w) < canvas.width + 5) {
        paddle.x += paddle.dx;
    }
}

//propriété life
let life_x = 35;
let life_y = 5;

//Relatif à tout ce qui concerne l'affichage
function draw() {
    ctx.drawImage(BACKGROUND_IMG, 0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    drawYellowBricks();

    showStats(SCORE_IMG, canvas.width - 100, 5, score, canvas.width - 65, 22);
        for(let l = 0; l < life; l++){
            showStats(LIFE_IMG, life_x, life_y, life, 70, 22);
            life_x += 10;
        }
    showStats(LEVEL_IMG, canvas.width/2 - 25, 5, level, canvas.width/2, 22);
}

//Relatif à tout ce qui concerne les intéractions et l'animation
function update(){
    movePaddle();
    moveBall();
    bmCollision();
    bpCollision();
    bybCollision();
  
    gameover();
    nextLevel();
}
function loop() {
    

    if(!isPaused){

    ctx.clearRect(0, 0, canvas.width, canvas.height);      
    draw();
    
    update();
    }
    if(level >= 2){
        drawGreenBricks();
        bgbCollision();
    }
    
      if(!gameOver){
        requestAnimationFrame(loop);
        }
     }


loop();


//Affichage des infos de fin de partie
function showEndInfo(type = 'win') {
    game_over.style.visibility = 'visible';
    game_over.style.opacity = '1';

    if(type === 'win'){
        youWon.style.visibility = 'visible';
        youLose.style.visibility = 'hidden';
        youLose.style.opacity = '0';
    } else {
        youWon.style.visibility = 'hidden';
        youWon.style.opacity = '0';
        youLose.style.visibility = 'visible';
       

    }
}

//Rejouer
restart.addEventListener('click', ()=> {
    location.reload();
})

//Gestion des évènements audio
const sound = document.getElementById('sound');
sound.addEventListener('click', audioManager);

function audioManager(){
    //changer l'image
    let imgSrc = sound.getAttribute('src');
    let SOUND_IMG = imgSrc === 'img/sound_on.png' ? 'img/mute.png' : 'img/sound_on.png'
    sound.setAttribute('src', SOUND_IMG);

    WALL_HIT.muted = !WALL_HIT.muted;
    PADDLE_HIT.muted = !PADDLE_HIT.muted;
    BRICK_HIT.muted = !BRICK_HIT.muted;
    WIN.muted = !WIN.muted;
    LIFE_LOST.muted = !LIFE_LOST.muted;
}

