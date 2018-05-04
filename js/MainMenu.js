var Global = Global || {};

Global.MainMenu = function() {};

Global.MainMenu.prototype = {
	create: function() {
		Global.game.stage.backgroundColor = '#111111';

		/*var x = SCREEN_WIDTH - 50;
		var y = SCREEN_HEIGHT - 100;*/

		/* Title */
		/*var title = this.add.bitmapText( x, y, 'BalsamiqBold', 'Kactus Global', 72 );
		title.tint = 0x777777;
		title.anchor.set( 1, 1 );*/

		/*y += 50;
		var subtitle = this.add.bitmapText( x, y, 'BalsamiqBold', '- press start to play -', 32 );
		subtitle.tint = 0x777777;
		subtitle.anchor.set( 1, 1 );*/

		/* Input */

		var key = Global.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
		key.onDown.add( function() {this.startGame();}, this );

		// Skips menu
		this.state.start( 'Game' );
	},
	startGame: function ()
	{
		this.state.start( 'Game' );
	},
};