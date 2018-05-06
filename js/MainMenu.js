var Global = Global || {};

Global.MainMenu = function() {};

Global.MainMenu.prototype = {
	create: function() {
		Global.game.stage.backgroundColor = '#111111';

		// Looping sky
		var h = 600;
		this.sky = Global.game.add.tileSprite( 0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'sky');
		var s = SCREEN_HEIGHT / h;
		this.sky.scale.set(s, s);

		// Saloon
		this.clouds = Global.game.add.sprite( 0, 0, 'clouds');

		this.saloon = Global.game.add.sprite( 20, 115, 'saloon');
		this.saloon.scale.set(1, 1);

		this.floor1 = Global.game.add.sprite( 10, 580, 'floor1');
		this.floor1.scale.set(3, 1);

		this.slick = Global.game.add.sprite( 500, 100, 'slick');
		this.slick.scale.set(0.4, 0.4);

		this.trick = Global.game.add.sprite( 670, 350, 'coyotetrick1');
		this.trick.scale.set(0.4, 0.4);
		this.trick.anchor.set(0.5, 0.5);

		/*var x = SCREEN_WIDTH - 50;
		var y = SCREEN_HEIGHT - 100;*/

		/* Title */
		var x = 0, y = 0;
		this.title = this.add.bitmapText( x, y, 'Balsamiq', 'Press space to play', 50 );

		this.step = 0;

		/*y += 50;
		var subtitle = this.add.bitmapText( x, y, 'BalsamiqBold', '- press start to play -', 32 );
		subtitle.tint = 0x777777;
		subtitle.anchor.set( 1, 1 );*/

		/* Input */

		var key = Global.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
		key.onDown.add( function() {this.startGame();}, this );
	},
	update: function () {
		this.step += 1;
		this.title.y = 10 * Math.sin(0.08*this.step);
		this.trick.angle = 10 * Math.sin(0.08*this.step);
	},
	startGame: function ()
	{
		this.state.start( 'Game' );
	},
};