var BasicGame = {
	SEA_SCROLL_SPEED: 12,
	PLAYER_SPEED: 300,
	SPAWN_ENEMY_DELAY: 1000,
	SHOT_DELAY: 100,
	INSTRUCTION_EXPIRE: 10000,
	ENEMY_MIN_Y_VELOCITY: 30,
	ENEMY_MAX_Y_VELOCITY: 60,
	BULLET_VELOCITY: 500,
	ENEMY_HEALTH: 100,
	BULLET_DAMAGE: 25,
	CRASH_DAMAGE: 5,
	ENEMY_REWARD: 100,
	PLAYER_EXTRA_LIVES: 3,
	PLAYER_GHOST_TIME: 1500,
	RETURN_MESSAGE_DELAY: 5000
};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

	init: function () {

		//  Unless you specifically know your game needs to support multi-touch I would recommend
		// setting this to 1
		this.input.maxPointers = 1;

		//  Phaser will automatically pause if the browser tab the game is in loses focus. You can
		// disable that here:
		this.stage.disableVisibilityChange = true;

		if (this.game.device.desktop) {
			//  If you have any desktop specific settings, they can go in here
			this.scale.pageAlignHorizontally = true;
		}
		else {
			//  Same goes for mobile settings.
			//  In this case we're saying "scale the game, no lower than 480x260 and no higher than
			// 1024x768"
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.setMinMax(480, 260, 1024, 768);
			this.scale.forceLandscape = true;
			this.scale.pageAlignHorizontally = true;
		}

	},

	preload: function () {

	},

	create: function () {

		//  By this point the preloader assets have loaded to the cache, we've set the game settings
		//  So now let's start the real preloader going
		this.state.start('Preloader');

	}

};
