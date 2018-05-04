var Global = Global || {};

Global.Boot = function() {};

Global.Boot.prototype = {
	preload: function() {
		this.load.image( 'preloader-bar', 'assets/sprites/preloader-bar.png' );
	},
	create: function() {
		this.game.physics.startSystem( Phaser.Physics.ARCADE );
		this.state.start( 'Preload' );
	},
};
