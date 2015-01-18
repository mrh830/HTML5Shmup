BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		this.load.image('sea', 'assets/sea.png');
		this.load.image('bullet', 'assets/bullet.png');
		this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);
		this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);
		this.load.spritesheet('player', 'assets/player.png', 64, 64);

	},

	create: function () {

		this.state.start('Game');
	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game
		// experience. Basically it will wait for our audio file to be decoded before proceeding to
		// the MainMenu. You can jump right into the menu if you want and still play the music, but
		// you'll have a few seconds of delay while the mp3 decodes - so if you need your music to
		// be in-sync with your menu it's best to wait for it to decode here first, then carry on.

		//	If you don't have any music in your game then put the game.state.start line into the
		// create function and delete the update function completely.

		// if (this.cache.isSoundDecoded('titleMusic') && this.ready == false) {
		//  this.ready = true;

		//  }

	}

};
