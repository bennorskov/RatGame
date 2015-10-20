window.onload = function() {
	
	var cursors;
	var ratPlayer;

	var grassGroup;

	var game = new Phaser.Game(
		800, 600, 
		Phaser.AUTO, 	//rendering mode
		'ratGame', 		//id of where to stick the canvas
		{ preload: preload, create: create, update: update }
	);

	function preload() {
		game.load.image("ratPic", "images/ratCrop.png");
		game.load.image("grassPic", "images/grass.png");
		game.load.image("markerFlag", "images/markerFlag.png");
	}

	function create() {

		grassGroup = game.add.group();
		grassGroup.enableBody = true;

		var gSize = point(0, 0);
		var gOffset = point(60, 20);

		var mine = Math.floor( Math.random() * 25);
		
		for (var i = 0; i<5; i++) {
			for (var j = 0; j<5; j++) {
				var grass = grassGroup.create(i * gSize.x + gOffset.x, j * gSize.y + gOffset.y, 'grassPic');
				grass.scale = point(.4,.4);
				gSize = point(grass.width, grass.height);
			}
		}

		ratPlayer = game.add.sprite(game.world.centerX, game.world.centerY, "ratPic");
		ratPlayer.scale = new PIXI.Point(.5, .5);
		game.physics.arcade.enable(ratPlayer);

		ratPlayer.body.bounce.y = .2;
		ratPlayer.body.collideWorldBounds = true;
		ratPlayer.anchor.setTo(.5, .5);

		cursors = game.input.keyboard.createCursorKeys();
	}

	function update() {
		handleKeys();

	}

	function handleKeys() {
		var xDir = 0;
		var yDir = 0;
		var ratSpeed = 150;

		// left/right speed
		if (cursors.left.isDown) {
			xDir = -1;
			ratPlayer.scale = point(.5, .5);
		}else if (cursors.right.isDown) {
			xDir = 1;
			ratPlayer.scale = point(-.5, .5);
		} 

		// up/down speed
		if (cursors.up.isDown) {
			yDir = -1;
		} else if (cursors.down.isDown) {
			yDir = 1;
		}
		ratPlayer.body.velocity = point( xDir * ratSpeed, yDir * ratSpeed);
	}
}