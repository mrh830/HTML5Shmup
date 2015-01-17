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

        this.enemy = this.add.sprite(400, 200, 'greenEnemy');
        this.enemy.animations.add('fly', [0, 1, 2], 20, true);
        this.enemy.play('fly');
        this.enemy.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.enemy, Phaser.Physics.ARCADE);

        this.bullets = [];
        this.nextShotAt = 0;
        this.shotDelay = 100;

        this.cursors = this.input.keyboard.createCursorKeys();

        this.instructions = this.add.text(400, 500, 'Use arrow keys to move\n' + 'Press Z to fire\n' + 'Tapping/clicking does both at once', {
            font: '20px monspace',
            fill: '#fff',
            align: 'center'
        });
        this.instructions.anchor.setTo(0.5, 0.5);
        this.instExpire = this.time.now + 8000;
    },

    enemyHit: function (bullet, enemy) {
        bullet.kill();
        enemy.kill();

        var explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);
        explosion.animations.add('boom');
        explosion.play('boom', 15, false, true);
    },

    fire: function () {

        if (this.nextShotAt > this.time.now) {
            return;
        }

        this.nextShotAt = this.time.now + this.shotDelay;

        var bullet = this.add.sprite(this.player.x, this.player.y - 20, 'bullet');
        bullet.anchor.setTo(0.5, 0.5);
        this.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.body.velocity.y = -500;
        this.bullets.push(bullet);
    },
    update: function () {

        this.sea.tilePosition.y += 0.2;

        for (var i = 0; i < this.bullets.length; i++) {
            this.physics.arcade.overlap(this.bullets[i], this.enemy, this.enemyHit, null, this);
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
