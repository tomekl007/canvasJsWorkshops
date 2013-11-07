
console.log('init...');


var canvas = document.getElementById('myCanvas'),
	context = canvas.getContext('2d'),
	width = 640,
	height = 480;

var gameloop = null,
	frames = 50;

var moveInvadersLeft = false;

var movingInvaders = setInterval(function() {
	moveInvadersLeft = moveInvadersLeft ? false : true;
}, 1000);


function stopGame() {
	clearInterval(gameloop);
}
function restartGame() {
	window.location.href = window.location.href;
}


var invaders = [],
	ship = {},
	bullets = [];

var steps = {
		ship: 10,
		bullet: 5
	};

var moves = {
	left: false,
	right: false,
	fire: false
};

$(document).keydown(function(e) {
	if (e.keyCode == 37) {
		console.log("left pressed");
		moves.left = true;
	}
	if (e.keyCode == 39) {
		console.log("right pressed");
		moves.right = true;
	}
	if (e.keyCode == 70) {
		console.log("space pressed");
		moves.fire = true;
	}
});


/*
 * invaders
 *************************/

function createInvader(x, y) {
	invaders.push({
		x: x,
		y: y
	});
}

function createInvadersInRow() {
	var x, y;
	for (var i = 0; i < 10; i++) {
		x = (i * 48) + 64;
		y = 43;
		createInvader(x, y);
	}
}

function moveInvadersInRow() {
	if (moveInvadersLeft) {
		for (var i = 0, len = invaders.length; i < len; i++) {
			invaders[i].x -= 1;
		}
	} else {
		for (var i = 0, len = invaders.length; i < len; i++) {
			invaders[i].x += 1;
		}
	}
}




function renderInvader(x, y) {
	var w = 32,
		h = 32;
	context.beginPath();
	context.rect(x - (w / 2), y - (h / 2), w, h);
	context.fillStyle = 'red';
	context.fill();
	context.lineWidth = 5;
	context.strokeStyle = 'black';
	context.stroke();
}

function renderInvaders() {
	for (var i = 0, len = invaders.length; i < len; i++) {
		renderInvader(invaders[i].x, invaders[i].y);
	}
}

/*
 * ship
 *************************/

function createShip(x, y) {
	ship = {
		x: x,
		y: y
	};
}

function moveShip(moves) {
	if (moves.left) {
		if (ship.x >= 40) {
			ship.x -= steps.ship;
		}
		moves.left = false;
	}
	if (moves.right) {
		if (ship.x <= (width - 40)) {
			ship.x += steps.ship;
		}
		moves.right = false;
	}

}

function renderShip(x, y) {
	var w = 32,
		h = 32;
	context.beginPath();
	context.rect(x - (w / 2), y - (h / 2), w, h);
	context.fillStyle = 'green';
	context.fill();
	context.lineWidth = 5;
	context.strokeStyle = 'black';
	context.stroke();
}

/*
 * ship
 *************************/

function createBullet(x, y) {
 	bullets.push({
		x: x,
		y: y
	});
}

function lunchBullet(moves) {
	if (moves.fire) {
		createBullet(ship.x, ship.y);
		moves.fire = false;
	}
}

function renderBullet(x, y) {
	var w = 8,
		h = 8;
	context.beginPath();
	context.arc(x, y, 1, 2 * Math.PI, false);
	context.fillStyle = '#16f';
	context.fill();
	context.lineWidth = 5;
	context.strokeStyle = '#00a';
	context.stroke();
}

function moveBullets() {
	for (var i = 0, len = bullets.length; i < len; i++) {
		bullets[i].y -= steps.bullet;
	}
}

function renderBullets() {
	for (var i = 0, len = bullets.length; i < len; i++) {
		renderBullet(bullets[i].x, bullets[i].y);
	}
}

/*
 * colisions
 *************************/

function destroyInvader() {
	for (var i = 0, ilen = bullets.length; i < ilen; i++) {
		for (var j = 0, jlen = invaders.length; j < jlen; j++) {
			if (Math.abs(bullets[i].x - invaders[j].x) < 16 && Math.abs(bullets[i].y - invaders[j].y) < 16) {
				// explosion
				console.warn('explosion');

				bullets[i].y -= 100;
				invaders[j].y -= 100;
			}
		}
	}
}




function init() {
	createInvadersInRow();
	createShip(320, 440);
}

function clear() {
	var background = new Image();

	background.onload = function() {
		context.drawImage(background, 0, 0);
	};
	background.src = 'http://localhost/~ash/SpaceInvaders/img/gridBackground.gif';

	context.fillStyle = 'transparent';
	context.beginPath();
	context.rect(0, 0, width, height);
	context.closePath();
	context.fill();
}

function update() {
	moveInvadersInRow();
	moveShip(moves);
	lunchBullet(moves);
	moveBullets()
	destroyInvader();
}

function render() {
	renderInvaders();
	renderShip(ship.x, ship.y);
	renderBullets();
}

function startGame() {
	init();

// while (true) {
	gameloop = setInterval(function() {
		console.log('.');

		clear();

		// var x = Math.floor((Math.random()*600)+40);
		// var y = Math.floor((Math.random()*240)+40);

		// console.log(x);
		// console.log(y);

		// renderInvader(x, y);
		

		update();
		render();
	}, 1000 / frames);
// }

}

startGame();


