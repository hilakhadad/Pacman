var context = canvas.getContext("2d");
var shape = new Object();
var board;
var score=0;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var intervalTwo;
var right;
var left;
var up;
var down;
var food;
var points5;
var points15;
var points25;
var time;
var monsters;
var enemy;
var enemyImg;
var boardLnt = 16;
var pacman_remain = 3;
var locations = new Array(new Array(1,1),new Array(boardLnt,1),new Array(1,boardLnt));

function setAllForGame() {
    right = $("#contact_right_button").val();
    left = $("#contact_left_button").val();
    up = $("#contact_up_button").val();
    down = $("#contact_down_button").val();
    food = $("#contact_food").val();
    points5 = $("#contact_5_points").val();
    points15 = $("#contact_15_points").val();
    points25 = $("#contact_25_points").val();
    time = $("#contact_play_time").val();
    monsters = $("#contact_monsters").val();
}
function findRandomEmptyCell(board) {
        var i = getRandomInt(boardLnt);
        var j = getRandomInt(boardLnt);
        while (board[i][j] !== 0) {
            var i = getRandomInt(boardLnt);
            var j = getRandomInt(boardLnt);
        }
        return [i, j];
    }


            /**
             * @return {number}
             */
function GetKeyPressed() {
                if (keysDown[up])
                    return 1;
                if (keysDown[down])
                    return 2;
                if (keysDown[left])
                    return 3;
                if (keysDown[right])
                    return 4;
            }

function Draw() {
    context.clearRect(0, 0, canvas.width, canvas.height); //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    for (var i = 0; i < boardLnt+2; i++) {
        for (var j = 0; j < boardLnt+2; j++) {
            var center = new Object();
            center.x = i * 40 + 20;
            center.y = j * 40 + 20;
            if (board[i][j] === 2) {
                context.beginPath();
                context.arc(center.x, center.y, 20, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color
                context.fill();
                context.beginPath();
                context.arc(center.x + 5, center.y - 12, 2.5, 0, 2 * Math.PI); // circle
                context.fillStyle = "black"; //color
                context.fill();
            } else if (board[i][j] === 25) {
                context.beginPath();
                context.arc(center.x, center.y, 17.5, 0, 2 * Math.PI); // circle
                context.fillStyle = points25; //color
                context.fill();
            } else if (board[i][j] === 15) {
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
                context.fillStyle = points15; //color
                context.fill();
            } else if (board[i][j] === 5) {
                context.beginPath();
                context.arc(center.x, center.y, 12.5, 0, 2 * Math.PI); // circle
                context.fillStyle = points5; //color
                context.fill();
            } else if (board[i][j] === 4) {
                context.beginPath();
                context.rect(center.x - 20, center.y - 20, 40, 40);
                context.fillStyle = "grey"; //color
                context.fill();
            }
            for (let k = 0; k < monsters; k++) {
                var thaMonsterImg = enemyImg[k];
                var thaMonster = enemy[k];
                if (i == thaMonster.x && j == thaMonster.y)
                    context.drawImage(thaMonsterImg, i * 40, j*40,40,40);
            }
        }
    }
}

function UpdatePosition() {
    board[shape.i][shape.j] = 0;
    var x = GetKeyPressed();
    if (x === 1)
        if (shape.j > 0 && board[shape.i][shape.j - 1] !== 4)
            shape.j--;
    if (x === 2)
        if (shape.j < boardLnt + 1 && board[shape.i][shape.j + 1] !== 4)
            shape.j++;
    if (x === 3)
        if (shape.i > 0 && board[shape.i - 1][shape.j] !== 4)
            shape.i--;
    if (x === 4)
        if (shape.i < boardLnt + 1 && board[shape.i + 1][shape.j] !== 4)
            shape.i++;
    if (board[shape.i][shape.j] === 5)
        score += 5;
    if (board[shape.i][shape.j] === 15)
        score += 15;
    if (board[shape.i][shape.j] === 25)
        score += 25;
    board[shape.i][shape.j] = 2;
    var currentTime = new Date();
    time_elapsed = time - ((currentTime - start_time) / 1000);
    if (score >= 20 && time_elapsed <= 10)
        pac_color = "green";
    if (time_elapsed <= 0) {
        window.clearInterval(interval);
        window.clearInterval(intervalTwo);
        window.alert("Time is up! LOSER!!!");
        goTo("settings");
    }
    var food_5 = Math.floor(food * 0.6);
    var food_15 = Math.floor(food * 0.3);
    var food_25 = food - food_5 - food_15;
    if (score === food_5 * 5 + food_15 * 15 + food_25 * 25) {
        window.clearInterval(interval);
        window.clearInterval(intervalTwo);
        window.alert("Game completed");
        goTo("settings");
    } else
        Draw();
}

function updateMonsters() {
    var lost = false;
    for (let i = 0; i <monsters && !lost; i++) {
        var xMonster = enemy[i].x;
        var yMonster = enemy[i].y;
        var booleanUp = (yMonster > 0 && board[xMonster ][yMonster-1] !== 4);
        var booleanDown = (yMonster < boardLnt+1 && board[xMonster][yMonster+1] !== 4);
        var booleanLeft = (xMonster > 0 && board[xMonster - 1][yMonster] !== 4);
        var booleanRight = (xMonster < boardLnt+1 && board[xMonster+ 1][yMonster] !== 4);
        if (xMonster === shape.i && yMonster===shape.j) {
            score-=10;
            lost=true;
            window.clearInterval(interval);
            window.clearInterval(intervalTwo);
            window.alert("You have "+pacman_remain+" more lives!");
            Start();
        }
        else {
            var rand = Math.random();
            if (rand > 0.5 && shape.i < xMonster && booleanLeft)
                enemy[i].x = xMonster - 1;
            else if (shape.j < yMonster && booleanUp)
                enemy[i].y = yMonster - 1;
            else if (rand < 0.5 && shape.i > xMonster && booleanRight)
                enemy[i].x = xMonster + 1;
            else if (shape.i > yMonster && booleanDown)
                enemy[i].y = yMonster + 1;
            else {
                if (rand > 0.5 && booleanUp)
                    enemy[i].y = yMonster - 1;
                else if (rand > 0.5 && booleanDown)
                    enemy[i].y = yMonster + 1;
                else if (booleanLeft)
                    enemy[i].x = xMonster - 1;
                else if (booleanRight)
                    enemy[i].x = xMonster + 1;
            }
        }
    }
}

function startNewGame(){
    score=0;
    pacman_remain=3;
    Start();
}

function Start() {
    board = new Array();
    pac_color = "yellow";
    var cnt = boardLnt*boardLnt;
    var food_remain = food;
    var food_remain_5 = Math.floor(food*0.6);
    var food_remain_15 = Math.floor(food*0.3);
    var food_remain_25 = food - food_remain_5 - food_remain_15;
    start_time = new Date();
    for (var i = 0; i < boardLnt + 2; i++) {
        board[i] = new Array();
        for (var j = 0; j < boardLnt + 2; j++) {
            if (i === 0 || j === 0 || i === boardLnt + 1 || j === boardLnt + 1 || (i === 1 && j === 3) ||
                (i === 2 && j === 6)|| (i === 2 && j === 7)|| (i === 2 && j === 8)|| (i === 2 && j === 11)|| (i === 2 && j === 12)|| (i === 2 && j === 13)|| (i === 2 && j === 14)|| (i === 2 && j === 15) ||
                (i === 3 && j === 2)|| (i === 3 && j === 3)|| (i === 3 && j === 4)|| (i === 3 && j === 5)|| (i === 3 && j === 6)|| (i === 3 && j === 13)|| (i === 3 && j === 15)||
                (i === 4 && j === 2)|| (i === 4 && j === 6)|| (i === 4 && j === 9)|| (i === 4 && j === 10)|| (i === 4 && j === 11)|| (i === 4 && j === 13)|| (i === 4 && j === 15) ||
                (i === 5 && j === 2)|| (i === 5 && j === 4)|| (i === 5 && j === 6)|| (i === 5 && j === 9)|| (i === 5 && j === 11)|| (i === 5 && j === 13)|| (i === 5 && j === 15) ||
                (i === 6 && j === 2)|| (i === 6 && j === 4)|| (i === 6 && j === 6)|| (i === 6 && j === 9)|| (i === 6 && j === 11)|| (i === 6 && j === 13)|| (i === 6 && j === 15) ||
                (i === 7 && j === 2)|| (i === 7 && j === 4)|| (i === 7 && j === 6)|| (i === 7 && j === 9)|| (i === 7 && j === 11)|| (i === 7 && j === 15) ||
                (i === 8 && j === 4)|| (i === 8 && j === 6)|| (i === 8 && j === 9)|| (i === 8 && j === 11)|| (i === 8 && j === 15)||
                (i === 9 && j === 2)||(i === 9 && j === 4)|| (i === 9 && j === 6)|| (i === 9 && j === 9)|| (i === 9 && j === 11)||(i === 9 && j === 12)||(i === 9 && j === 13)|| (i === 9 && j === 15)||
                (i === 10 && j === 2)||(i === 10 && j === 4)|| (i === 10 && j === 6)|| (i === 10 && j === 8)|| (i === 10 && j === 9)||(i === 10 && j === 11)|| (i === 10 && j === 15)||
                (i === 11 && j === 2)||(i === 11 && j === 4)|| (i === 11 && j === 6)|| (i === 11 && j === 8)||(i === 11 && j === 11)|| (i === 11 && j === 15)||
                (i === 12 && j === 2)||(i === 12 && j === 4)|| (i === 12 && j === 6)|| (i === 12 && j === 8)||(i === 12 && j === 11)|| (i === 12 && j === 13)|| (i === 12 && j === 15)||
                (i === 13 && j === 2)|| (i === 13 && j === 6)|| (i === 13 && j === 8)||(i === 13 && j === 11)|| (i === 13 && j === 13)|| (i === 13 && j === 15)||
                (i === 14 && j === 2)|| (i === 14 && j === 3)|| (i === 14 && j === 4)||(i === 14 && j === 6)|| (i === 14 && j === 11)|| (i === 14 && j === 13)|| (i === 14 && j === 15)||
                (i === 15 && j === 6)|| (i === 15 && j === 7)|| (i === 15 && j === 8)||(i === 15 && j === 9)|| (i === 15 && j === 11)|| (i === 15 && j === 13)|| (i === 15 && j === 15)
            ) {
                board[i][j] = 4;
            } else {
                var randomNum = getRandomInt(100);
                if (randomNum > 60) {
                    if (randomNum > 90 && food_remain_25 > 0) {
                        board[i][j] = 25;
                        food_remain_25--;
                        food_remain--;
                    } else if (randomNum > 80 && food_remain_15 > 0) {
                        board[i][j] = 15;
                        food_remain_15--;
                        food_remain--;
                    } else if (randomNum > 70 && food_remain_5 > 0) {
                        board[i][j] = 5;
                        food_remain_5--;
                        food_remain--;
                    }
                } else {
                    board[i][j] = 0;
                }
                cnt--;
            }
        }
    }
    if (pacman_remain > 0){
        let cellForPacmen = findRandomEmptyCell(board);
        let xCell =cellForPacmen[0];
        let yCell =cellForPacmen[1];
        board[xCell][yCell]=2;
        shape.i = xCell;
        shape.j = yCell;
        pacman_remain--;
    }
    else{
        window.clearInterval(interval);
        window.clearInterval(intervalTwo);
        window.alert("No More Lives!\n You lost\n Your score is "+score+"!!!");
        goTo("settings");
        return;
    }
    enemyImg = new Array();
    enemy = new Array();
    for (let i = 0; i <monsters; i++) {
        enemyImg[i] = new Image();
        enemyImg[i].src = "monster" + i + ".png";
        enemy[i] = {};
        let cellForMonster = locations[i];
        let xMonster = cellForMonster[0];
        let yMonster = cellForMonster[1];
        if (!(board[xMonster][yMonster] === 4 || board[xMonster][yMonster] === 2)) {
            enemy[i].x = xMonster;
            enemy[i].y = yMonster;
        } else
            i--;
    }
    while (food_remain > 0) {
        var emptyCell = findRandomEmptyCell(board);
        if(food_remain_25>0) {
            board[emptyCell[0]][emptyCell[1]] = 25;
            food_remain_25--;
        }
        else if(food_remain_15>0) {
            board[emptyCell[0]][emptyCell[1]] = 15;
            food_remain_15--;
        }
        else {
            board[emptyCell[0]][emptyCell[1]] = 5;
            food_remain_5--;
        }
        food_remain--;
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.code] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.code] = false;
    }, false);
    interval = setInterval(UpdatePosition, 100);
    intervalTwo = setInterval(updateMonsters,200);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
