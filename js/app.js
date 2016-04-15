/**
* props is an object containing a bunch of constants
*/
var props = {
    rowHeight: 83, // height of a row
    colWidth: 101, // width of a column
    bottomOffset: 20, //empty space on y axis at bottom of sprites
    topOffset: 75, //empty space at the top of sprites
    canvas: {x: 707, y: 606}, //canvas width/height
    celebratePoints: 10, // number of points to increment upon reaching water
    levelParam: 1, //number of times do you have to go swimming to get to the next level
    oneupParam: 3 // number levels before you are awarded another life
}

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
    * */
    if(this.x + props.colWidth > player.x + props.colWidth/4 && player.x + (3/4)*props.colWidth > this.x){
        if(this.y < player.y + props.rowHeight && this.y >= player.y){
            player.die();
        }
    }
    /* once off the screen, reset the enemy position */
    if(this.x > props.canvas.x){
        this.setMovement();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Set an initial position for an Enemy instance
*/
Enemy.prototype.setMovement = function() {
    var row = Math.floor((Math.random() * 3) + 1);
    var initX = -(Math.random() * 500) - props.colWidth; //start 0 - 500 px offscreen

    /*
    * speed is detemined sorta randomly
    * with the caveat that there are slow lanes (larger row values are slower)
    */
    this.speed = (Math.random() + 1) * 300 - row * 75;
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
/**
* @description sets initial player position
*/
Player.prototype.setInitialPosition = function(){
    this.x = props.colWidth * 3;
    this.y = props.rowHeight * 4 - props.bottomOffset;
}
/**
* @description set a different sprite
* @param {string} path is the path to the image
*/
Player.prototype.setSprite = function(path){
    this.sprite = path;
}
/**
* @description Defines what happens when the player reaches the water
*/
Player.prototype.celebrate = function(){
    //increment the score;
    score.increment();

    //increase the enemyMult by adding enemies, which adds progressively more enemies...
    if(Math.floor(enemyMult + 1/props.levelParam) > enemyMult){
        allEnemies.push(new Enemy());
        level.increment();
    }
    enemyMult = enemyMult + 1/props.levelParam;

    //one-up every three levels
    if(level.getValue() % props.oneupParam == 0){
        lives.oneUp();
    }

    //return the player to initial position
    this.setInitialPosition();
}

/**
* @description Deines what happens when an enemy collides with the player.
* The player is returned to their original position and lives decremented.
* The game is reset if player's out of lives.
*/
Player.prototype.die = function(){
    this.setInitialPosition();
    lives.increment();
    if(lives.getValue() == 0){
        reset();
    }
}

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

/**
* @description Resets all objects.
* TODO: use the engine.js reset method
*/
function reset(){
    level.reset();
    lives.reset();
    score.reset();
    allEnemies = [];
    enemyMult = 1.0; //initial number of enemies
    allEnemies.push(new Enemy());
}

/**
* @description The Counter object is used to store and display score and level in the game
* @constructor
* @param {integer} x - x-position on canvas of Counter
* @param {integer} y - y-position on canvas of Counter
* @param {string} name - display name of the Counter
* @param {integer} initialValue – initial value of Counter
* @param {integer} incrementAmount - how much Counter will be incremented when increment() is called
*/
var Counter = function(x, y, name, initialValue, incrementAmount){
    this.constructor
    this.fontSize = 24;
    this.font = this.fontSize+'px sans-serif';
    this.x = x;
    this.y = y;
    this.name = name;
    this.initialValue = initialValue;
    this.value = initialValue;
    this.incrementAmount = incrementAmount || 1;
};

/**
* @description Render() renders the name/value pair on a white background in the game
*/
Counter.prototype.render = function(){
    ctx.font = this.font;
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fillRect(this.x, this.y - this.fontSize, this.fontSize * this.name.length , this.fontSize + 3);
    ctx.fillStyle = 'black';
    ctx.fillText(this.name + ': ' + this.value, this.x, this.y);
};

/**
* @description setValue() sets the counter value
* @param {integer} val - value to set Counter to
*/
Counter.prototype.setValue = function(val){
    this.value = val;
};

/**
* @description getValue returns the current value
*/
Counter.prototype.getValue = function(){
    return this.value;
};

/**
* @description Adds the incrementValue to the current value of the counter
*/
Counter.prototype.increment = function(){
    this.value = this.value + this.incrementAmount;
};

/**
* @description Set the counter to its original value
*/
Counter.prototype.reset = function(){
    this.value = this.initialValue;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var enemyMult = 1.0; //initial number of enemies
allEnemies.push(new Enemy());

//initialize our various counters
var level = new Counter(5, 575, 'Level', 1);
var score = new Counter(5, 540, 'Score', 0, 10);
var lives = new Counter(5, 505, 'Lives', 3, -1);

//oneUp extends the generic Counter. When you go up a level, you get an extra life!
lives.oneUp = function(){
    this.value++;
}
var player = new Player();
