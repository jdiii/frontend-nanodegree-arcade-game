var props = {
    rowHeight: 83,
    colWidth: 101,
    bottomOffset: 20,
    topOffset: 75,
    canvas: {x: 505, y: 606},
    goalY: this.rowHeight,
    celebratePoints: 10,
} //this is a bit hacky...

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.setMovement();
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// Collision detection w/ the player
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = (this.x + this.speed * dt);

    /* *
    * collision detection between our single instance of player and any enemy
    *
    * */
    if(this.x + props.colWidth >= player.x + props.colWidth/2 && this.x < player.x){
        if(this.y < player.y + props.rowHeight && this.y >= player.y){
            player.die();
        }
    }

    /* once off the screen, reset the enemy position */
    if(this.x > props.canvas.x){
        this.setMovement(dt);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* *
* Set an initial position for an Enemy instance
* Set a random speed between 300 and 600 for the Enemy instance
*/
Enemy.prototype.setMovement = function() {
    var row = Math.floor((Math.random() * 3) + 1);
    var initX = -(Math.random()) * 500; //start 0 - 500 px offscreen
    this.speed = (Math.random() + 1) * 200;
    this.x = initX;
    this.y = (row * props.rowHeight) - props.bottomOffset;
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.setInitialPosition();
    this.sprite = 'images/char-boy.png';
};
Player.prototype.handleInput = function(key){
    if(key == 'left' && this.x - props.colWidth >= 0){
        this.x = this.x - props.colWidth;
    } else if (key == 'left' && this.x - props.colWidth < 0){
        // allow the player's x-position to wrap when pressing 'left'
        // this is physically absurd, but it makes the game more fun
        this.x = props.canvas.x - props.colWidth;
    } else if (key == 'right' && this.x + props.colWidth < props.canvas.x) {
        this.x = this.x + props.colWidth;
    } else if (key == 'right' && this.x + props.colWidth >= props.canvas.x) {
        // allow player's x-positon to wrap when pressing 'right'
        this.x = 0;
    } else if (key == 'up'){
        this.y = this.y - props.rowHeight;
    } else if (key == 'down' && this.y + props.rowHeight + props.bottomOffset < 6*props.rowHeight){
        this.y = this.y + props.rowHeight;
    }
};
/* update() determines whether the player has made it to the water */
Player.prototype.update = function(){
    if (this.y < 0){
        this.celebrate();
    }
};
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.setInitialPosition = function(){
    this.x = props.colWidth * 2;
    this.y = props.rowHeight * 4 - props.bottomOffset;
}
/* *
* set a different sprite
* param path is the path to the image
*/
Player.prototype.setSprite = function(path){
    this.sprite = path;
}
/* *
* celebrate() defines what happens when the player reaches the water
*/
Player.prototype.celebrate = function(){
    //increment the score;
    playerScore = playerScore + props.celebratePoints;
    updateScoreDisplay();

    //increase the enemyMult by adding enemies, which adds progressively more enemies...
    if(Math.floor(enemyMult + 0.5) > enemyMult){
        allEnemies.push(new Enemy());
        var els = document.getElementsByClassName("enemyCount");
        [].forEach.call(els,function(el){
            el.textContent = Math.floor(allEnemies.length);
        });
    }
    enemyMult = enemyMult + 0.5;

    //return the player to initial position
    this.setInitialPosition();
}

/* *
* die() dfines what happens when an enemy collides with the player
*/
Player.prototype.die = function(){
    this.setInitialPosition();
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


var playerScore = 0;
var allEnemies = [];
var enemyMult = 1.0; //initial number of enemies
for(var i = 0; i < Math.floor(enemyMult); i++){
    allEnemies.push(new Enemy());
    updateEnemyDisplay();
}
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


/* this provides the reset button functionality */
function reset(){
    playerScore = 0;
    allEnemies = [];
    enemyMult = 1.0; //initial number of enemies
    allEnemies.push(new Enemy());
    updateScoreDisplay();
    updateEnemyDisplay();
}
//this updates the score value that's shown on the page
function updateScoreDisplay(){
    var scoreEls = document.getElementsByClassName("playerScore");
    [].forEach.call(scoreEls,function(el){
        el.textContent = playerScore;
    });
}
//this updates the enemy count that's shown on the page
function updateEnemyDisplay(){
    var els = document.getElementsByClassName("enemyCount");
    [].forEach.call(els,function(el){
        el.textContent = allEnemies.length;
    });
}
