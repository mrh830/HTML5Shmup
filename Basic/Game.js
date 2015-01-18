BasicGame.Game = function (game) {

	//  When a State is added to Phaser it automatically has the following properties set on it,
	// even if they already exist:

	this.game;      //  a reference to the currently running game (Phaser.Game)
	this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
	this.camera;    //  a reference to the game camera (Phaser.Camera)
	this.cache;     //  the game cache (Phaser.Cache)
	this.input;     //  the global input manager. You can access this.input.keyboard,
					// this.input.mouse, as well from it. (Phaser.Input)
	this.load;      //  for preloading assets (Phaser.Loader)
	this.math;      //  lots of useful common math operations (Phaser.Math)
	this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
					// (Phaser.SoundManager)
	this.stage;     //  the game stage (Phaser.Stage)
	this.time;      //  the clock (Phaser.Time)
	this.tweens;    //  the tween manager (Phaser.TweenManager)
	this.state;     //  the state manager (Phaser.StateManager)
	this.world;     //  the game world (Phaser.World)
	this.particles; //  the particle manager (Phaser.Particles)
	this.physics;   //  the physics manager (Phaser.Physics)
	this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

	//  You can use any of these from any function within this State.
	//  But do consider them as being 'reserved words', i.e. don't create a property for your own
	// game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {

	create: function () {

		this.gameWidth = this.game.width;
		this.gameHeight = this.game.height;

		this.sea = this.add.tileSprite(0, 0, this.gameWidth, this.gameHeight, 'sea');

		this.player = this.add.sprite(400, 550, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		this.player.animations.add('fly', [0, 1, 2], 20, true);
		this.player.play('fly');
		this.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.speed = 300;
		this.player.body.collideWorldBounds = true;
		this.player.body.setSize(20, 20, 0, -5);

		this.enemyPool = this.add.group();
		this.enemyPool.enableBody = true;
		this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemyPool.createMultiple(50, 'greenEnemy');
		this.enemyPool.setAll('anchor.x', 0.5);
		this.enemyPool.setAll('anchor.y', 0.5);
		this.enemyPool.setAll('outOfBoundsKill', true);
		this.enemyPool.setAll('checkWorldBounds', true);
		this.enemyPool.forEach(function (enemy) {
			enemy.animations.add('fly', [0, 1, 2], 20, true);
		});

		this.nextEnemyAt = 0;
		this.enemyDelay = 1000;

		this.bulletPool = this.add.group();
		this.bulletPool.enableBody = true;
		this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.bulletPool.createMultiple(100, 'bullet');
		this.bulletPool.setAll('anchor.x', 0.5);
		this.bulletPool.setAll('anchor.y', 0.5);
		this.bulletPool.setAll('outOfBoundsKill', true);
		this.bulletPool.setAll('checkWorldBounds', true);

		this.nextShotAt = 0;
		this.shotDelay = 100;

		this.explosionPool = this.add.group();
		this.explosionPool.enableBody = true;
		this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.explosionPool.createMultiple(100, 'explosion');
		this.explosionPool.setAll('anchor.x', 0.5);
		this.explosionPool.setAll('anchor.y', 0.5);
		this.explosionPool.forEach(function (explosion) {
			explosion.animations.add('boom');
		});

		this.cursors = this.input.keyboard.createCursorKeys();

		this.instructions = this.add.text(400, 500, 'Use arrow keys to move\n' + 'Press Z to fire\n' + 'Tapping/clicking does both at once', {
			font: '20px monspace',
			fill: '#fff',
			align: 'center'
		});
		this.instructions.anchor.setTo(0.5, 0.5);
		this.instExpire = this.time.now + 8000;
	},

	playerHit: function (player, enemy) {
		this.explode(enemy);
		enemy.kill();

		this.explode(player);
		player.kill();
	},

	enemyHit: function (bullet, enemy) {
		bullet.kill();

		this.explode(enemy);
		enemy.kill();
	},

	fire: function () {

		if (!this.player.alive || this.nextShotAt > this.time.now) {
			return;
		}

		if (this.bulletPool.countDead() === 0) {
			return;
		}

		this.nextShotAt = this.time.now + this.shotDelay;

		var bullet = this.bulletPool.getFirstExists(false);
		bullet.reset(this.player.x, this.player.y - 20);
		bullet.body.velocity.y = -500;
	},

	explode: function (sprite) {
		if (this.explosionPool.countDead() === 0) {
			return;
		}

		var explosion = this.explosionPool.getFirstExists(false);
		explosion.reset(sprite.x, sprite.y);
		explosion.play('boom', 15, false, true);
		explosion.body.velocity.x = sprite.body.velocity.x;
		explosion.body.velocity.y = sprite.body.velocity.y;
	},

	update: function () {

		this.sea.tilePosition.y += 0.2;

		this.physics.arcade.overlap(this.bulletPool, this.enemyPool, this.enemyHit, null, this);

		this.physics.arcade.overlap(this.player, this.enemyPool, this.playerHit, null, this);

		if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
			this.nextEnemyAt = this.time.now + this.enemyDelay;
			var enemy = this.enemyPool.getFirstExists(false);
			enemy.reset(this.rnd.integerInRange(20, 1004), 0);
			enemy.body.velocity.y = this.rnd.integerInRange(30, 60);
			enemy.play('fly');
		}

		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;

		if (this.cursors.left.isDown) {
			this.player.body.velocity.x = -this.player.speed;
		}
		else if (this.cursors.right.isDown) {
			this.player.body.velocity.x = this.player.speed;
		}

		if (this.cursors.up.isDown) {
			this.player.body.velocity.y = -this.player.speed;
		}
		else if (this.cursors.down.isDown) {
			this.player.body.velocity.y = this.player.speed;
		}

		if (this.input.activePointer.isDown && this.physics.arcade.distanceToPointer(this.player) > 5) {
			this.physics.arcade.moveToPointer(this.player, this.player.speed);
		}

		if (this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) {
			this.fire();
		}

		if (this.instructions.exists && this.time.now > this.instExpire) {
			this.instructions.destroy();
		}

	},

	render: function () {

	},

	quitGame: function (pointer) {

		//  Here you should destroy anything you no longer need.
		//  Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//  Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
