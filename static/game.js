var currentGame = [];
var nowMove = 'b';
var gameSize = 4;
var nowWins = '';
// для отмены последнего хода
var lastMove = [];
var lastReverse = [];

var createBoard = function(size) {
    var tbl = '<table class="board">';
    for(j=0; j<size; j++){
        tbl += '<tr>';
        for(i=0; i<size; i++){
            tbl += '<td><div id='+j+'_'+i+'></div></td>';
        };
        tbl += '</tr>';
    }
    tbl += '</table>';
    $('body').append(tbl);
    $('body').append('<button>Отменить последний ход</button>');

    $('button').click( function(){
        undoLastMove();
    });

}

var createGame = function(size) {

    createBoard(size);

    for(j=0; j<size; j++){
        currentGame[j]=[];
        for(i=0; i<size; i++){
            currentGame[j][i] = '-';
        }
    }
    //начальное положение
    var c = size / 2;

    x=c-1;  y=c-1;
    currentGame[y][x]='w';
    $('#'+y+'_'+x).addClass('white');
    x=c;  y=c;
    currentGame[y][x]='w';
    $('#'+y+'_'+x).addClass('white');

    x=c-1;  y=c;
    currentGame[y][x]='b';
    $('#'+y+'_'+x).addClass('black');
    x=c;  y=c-1;
    currentGame[y][x]='b';
    $('#'+y+'_'+x).addClass('black');

}

var getCurrentMoves = function (x,y,player){

    var currentMove = []; // массив, куда собирается все, что пеерворачивается
    var sopernik = 'b';
    if (player==='b') {sopernik='w';}

    var kArray = [
        [0,1],
        [0,-1],
        [1,0],
        [-1,0],
        [1,-1],
        [1,1],
        [-1,1],
        [-1,-1]
    ];

    for(k in kArray) {
        xk=kArray[k][1]; yk=kArray[k][0];
        currentX = x+xk; currentY = y+yk;
        var tempArray = [];
        while( currentX < gameSize && currentX >= 0 && currentY < gameSize && currentY >= 0) {
            if(currentGame[currentY][currentX]===sopernik) {
                tempArray[tempArray.length]= [currentY, currentX];
            }
            else if (currentGame[currentY][currentX]==='-') {
                tempArray = [];
                break;
            }
            else if(currentGame[currentY][currentX]===player) {
                for (ta in tempArray) {
                    currentMove[currentMove.length] = tempArray[ta];
                }
                tempArray = [];
                break;
            }
            currentX += xk;
            currentY += yk;
        }
    }

    return currentMove;
};

var Move = function(x, y) {

    if(currentGame[y][x]!='-') {return false;};

    currentMove=getCurrentMoves(x,y,nowMove);

    if(currentMove.length>0) {
        cl = 'white';
        scl = 'black'
        if(nowMove==='b') {cl='black';scl='white';}
        $('#'+y+'_'+x).addClass(cl);
        currentGame[y][x]=nowMove;

        lastMove = [];
        lastMove[0]=[y,x];
        lastMove[1]=[];

        rev = '';
        for(cm in currentMove) {
            x = currentMove[cm][1];
            y = currentMove[cm][0];
            currentGame[y][x]=nowMove;
            if(rev.length>0){rev+=',';}
            rev += '#'+y+'_'+x;

            lastMove[1][lastMove[1].length] = [y,x];

        }

        $(rev).removeClass(scl).addClass(cl);
        return true;
    }
    else {
        return false;
    }
};

var undoLastMove = function() {

    x = lastMove[0][1];
    y = lastMove[0][0];
    nowMove = currentGame[y][x];
    currentGame[y][x]='-';
    $('#'+y+'_'+x).removeClass('black').removeClass('white');

    revers='b';
    reversClass='black';
    opponentClass='white';
    if (nowMove==='b') {revers='w'; opponentClass='white';}

    for(lm in lastMove[1]) {
        x = lastMove[1][lm][1];
        y = lastMove[1][lm][0];

        currentGame[y][x]=revers;
        currentGame[y][x]=revers;

        $('#'+y+'_'+x).removeClass(reversClass).addClass(opponentClass);

    }

    showInfo();

}

var canMove = function(player) {
    for(j=0;j<gameSize;j++) {
        for(i=0;i<gameSize;i++) {
            if(currentGame[j][i]==='-' && getCurrentMoves(i,j,player).length>0){
                return true;
                break;
            }
        }
    }
    return false;
};

var gameOver = function(){
    if(nowWins==='b') {
        win = 'выиграл <div class="black"></div>';
    }
    else if (nowWins==='w') {
        win = 'выиграл <div class="white"></div>';
    }
    else {
        win = 'ничья!';
    }
    $('#gameOver').html("Игра окончена! "+win);
};


var onClick = function(id) {
    arr = id.split('_');
    x = Number(arr[1]);
    y = Number(arr[0]);
    if(Move(x, y)){
        if(nowMove==='b'){
            if(canMove('w')){
                nowMove='w';
            }
            else {
                if(!canMove('b')){
                    showInfo();
                    gameOver();
                }
            }
        }
        else {
            if(canMove('b')){
                nowMove='b';
            }
            else {
                if(!canMove('w')){
                    showInfo();
                    gameOver();
                }
            }
        }
    }
    showInfo();
};

var showInfo = function() {

    if(nowMove === 'b') {
        $('#now').removeClass('white').addClass('black');
    }
    else {
        $('#now').removeClass('black').addClass('white');
    }

    wCount = 0;
    bCount = 0;
    for(j=0;j<gameSize;j++) {
        for(i=0;i<gameSize;i++) {
            if(currentGame[j][i]==='w') {wCount++;}
            if(currentGame[j][i]==='b') {bCount++;}
        }
    }

    if(bCount>wCount){
        nowWins = 'b';
    }
    else if ((bCount<wCount))
        nowWins = 'w';
    else {
        nowWins = '-';
    };

    $('#bCount').html(bCount);
    $('#wCount').html(wCount);
    $('#gameOver').html("пока выигрывает "+nowWins);
};

$(document).ready(function(){
    createGame(gameSize);

    $('div').click(function(){
        onClick($(this).attr('id'));
    })

});