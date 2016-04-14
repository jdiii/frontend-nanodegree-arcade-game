var props = {
    rowHeight: 83,
    colWidth: 101,
    bottomOffset: 20,
    topOffset: 75,
    canvas: {x: 505, y: 606},
    goalY: this.rowHeight
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
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = (this.x + this.speed * dt);

    /* *
    * collision detection between our single instance of player and any enemy
    * multiline for line-length considerations...
    * */
    if(this.x >= player.x && this.x < player.x + props.colWidth){
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
Enemy.prototype.setMovement = function() {
    var row = Math.floor((Math.random() * 3) + 1);
    var initX = -(Math.random()) * 500; //start 0 - 500 px offscreen
    this.speed = (Math.random() + 1) * 300;
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
    } else if (key == 'right' && this.x + props.colWidth < props.canvas.x) {
        this.x = this.x + props.colWidth;
    } else if (key == 'up'){
        this.y = this.y - props.rowHeight;
    } else if (key == 'down' && this.y + props.rowHeight + props.bottomOffset < 6*props.rowHeight){
        this.y = this.y + props.rowHeight;
    }
};

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
Player.prototype.setSprite = function(path){
    this.sprite = path;
}
Player.prototype.celebrate = function(){
    this.setInitialPosition();
}
Player.prototype.die = function(){
    this.setInitialPosition();
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
var enemyMult = 1;
for(var i = 0; i < enemyMult; i++){
    allEnemies.push(new Enemy());
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
