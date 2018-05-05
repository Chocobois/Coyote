var Global = Global || {};

var SCREEN_WIDTH = 900;
var SCREEN_HEIGHT = 640;
var GRAPHICS_SCALE = 8;
var GAME_WIDTH = SCREEN_WIDTH / GRAPHICS_SCALE;
var GAME_HEIGHT = SCREEN_HEIGHT / GRAPHICS_SCALE;
Global.game = new Phaser.Game( SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.CANVAS );

Global.game.state.add( 'Boot', Global.Boot );
Global.game.state.add( 'Preload', Global.Preload );
Global.game.state.add( 'MainMenu', Global.MainMenu );
Global.game.state.add( 'Game', Global.Game );

Global.game.state.start( 'Boot' );

Global.debug = false;

var RED = 'rgba(255,0,0,0.4)';
var YELLOW = 'rgba(255,255,0,0.4)';
var GREEN = 'rgba(0,255,0,0.4)';
var CYAN = 'rgba(0,255,255,0.4)';
var BLUE = 'rgba(0,0,255,0.4)';
var PURPLE = 'rgba(255,0,255,0.4)';

var pl = planck;
var Vec2 = pl.Vec2;
