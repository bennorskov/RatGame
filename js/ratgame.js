window.onload = function() {
	
	var cursors;
	var ratPlayer;

	var groundGroup;
	var mineGroup;
	var mineArray = []; 
	//storing objects in a Phaser group means they come back as a sprite, not the Obj prototype

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
		game.load.image("groundplat", "images/groundplat.png");
		game.load.spritesheet("mine", "images/mine.png", 32, 32);
		game.load.image("indicator", "images/indicator.png");
	}
	// ——————————————— // ——————————————— // ——————————————— // ———————————————  Create
	function create() {
		cursors = game.input.keyboard.createCursorKeys();

		game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 600;

        //setup platform
        groundGroup = game.add.physicsGroup();
        var plat = new Platform(game, 30, 400, "groundplat", groundGroup);

        //setup Mines
        mineGroup = game.add.group();
        var mine = new Mine(game, 200, 450, "mine", "indicator", mineGroup);
        mineArray[0] = mine;

		setupPlayer();
	}
	function setupPlayer() {
		ratPlayer = game.add.sprite(40, game.world.centerY, "ratPic");
		ratPlayer.scale = point(.5, .5);

		game.physics.arcade.enable(ratPlayer);

		ratPlayer.body.bounce.y = .2;
		ratPlayer.body.collideWorldBounds = true;
		ratPlayer.anchor.setTo(.5, .5);
		ratPlayer.body.allowGravity = true;
	}
	//
	// ——————————————— // ——————————————— // ——————————————— // ———————————————  GameLoop
	//
	function update() {
	    game.physics.arcade.collide(ratPlayer, groundGroup);

		handleKeys();

		detectMines();
		displayMines();
	}
	function detectMines() {
		if (ratPlayer.x > mineArray[0].x) {
			mineArray[0].setDetectionState(1);
		}
	}
	function displayMines() {
		for (var i = mineArray.length - 1; i >= 0; i--) {
			mineArray[i].display();
		};
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
			ratPlayer.body.velocity.y = -200;
		} 

		ratPlayer.body.velocity = point( xDir * ratSpeed, ratPlayer.body.velocity.y);
	}
	//
	// ——————————————— // ——————————————— // ——————————————— // ———————————————  Definitions: Platform
	//
	var Platform = function(game, x, y, key, group) {
		 if (typeof group === 'undefined') { group = game.world; }
		
		Phaser.Sprite.call( this, game, x, y, key);
		game.physics.arcade.enable(this);
		this.body.allowGravity = false;
		this.body.immovable = true;

		group.add(this);//add to group passed in
	};
	Platform.prototype = Object.create(Phaser.Sprite.prototype);
	Platform.prototype.constructor = Platform;
	//
	// ——————————————— // ——————————————— // ——————————————— // ——————————————— Definitions: Mine
	//
	var Mine = function(game, x, y, key, indicatorKey, group) {
		if (typeof group === "undefined") { group = game.world; }
		Phaser.Sprite.call( this, game, x, y, key);
		this.animations.add("off", [0], 1, true);
		this.animations.add("on", [1], 1, true);
		//Add Animation Func: add(name, frames, frameRate, loop, useNumericIndex) 
		
		this.indicator = new IndicatorBase( game, x, y, indicatorKey, group );

		group.add(this);

		this.detectionLevel = 0; // 0 undetected, 1 detected //more states to come?

		this.setDetectionState = function( _state ) {
			//when the mine is detected, the level of detection is set here
			detectionLevel = _state;
			this.animations.play("on");
		}
	}
	Mine.prototype = Object.create(Phaser.Sprite.prototype);
	Mine.prototype.constructor = Mine;
	Mine.prototype.display = function() {
	}

	//
	// ——————————————— // ——————————————— // ——————————————— // ——————————————— Definitions: Indicator
	//	Indicator is the drawn-on indicator for detection space the mine will have due to sniffing
	//	it will associate with a mine, and be drawn through the mine's draw loop
	var IndicatorBase = function (game, x, y, key, group) {
		if (typeof group === "undefined") { group = game.world; }
		Phaser.Sprite.call( this, game, x, y, key);
		group.add(this);

	}
	IndicatorBase.prototype = Object.create( Phaser.Sprite.prototype );
	IndicatorBase.prototype.constructor = IndicatorBase;
}


