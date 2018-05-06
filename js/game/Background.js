
function Background ()
{
}

Background.prototype.create = function ()
{
	// Looping sky
	var h = 600;
	this.sky = Global.game.add.tileSprite( 0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'sky');
	var s = SCREEN_HEIGHT / h;
	this.sky.scale.set(s/GRAPHICS_SCALE, s/GRAPHICS_SCALE);

	var h = 500;
	this.clouds = Global.game.add.tileSprite( 0, 0, WORLD_WIDTH, h, 'clouds');
	var s = 1;
	this.clouds.scale.set(s/GRAPHICS_SCALE, s/GRAPHICS_SCALE);

	var h = 735;
	this.desert = Global.game.add.tileSprite( 0, 60, WORLD_WIDTH, h, 'desert');
	var s = 0.8;
	this.desert.scale.set(s/GRAPHICS_SCALE, s/GRAPHICS_SCALE);

	//this.halfpipe = Global.game.add.sprite(0, 0, 'halfpipe');
	//this.saloon = Global.game.add.sprite(0, 0, 'saloon');
	//this.floor1 = Global.game.add.sprite(0, 0, 'floor1');
	//this.floor2 = Global.game.add.sprite(0, 0, 'floor2');
};

Background.prototype.update = function()
{
	this.sky.x = Global.game.camera.x / GRAPHICS_SCALE / 1;
	this.sky.y = Global.game.camera.y / GRAPHICS_SCALE / 1;

	this.clouds.x = Global.game.camera.x / GRAPHICS_SCALE / 1.2;
	this.clouds.y = Global.game.camera.y / GRAPHICS_SCALE / 1.2;

	this.desert.x = 00 + Global.game.camera.x / GRAPHICS_SCALE / 2;
	this.desert.y = 60 + Global.game.camera.y / GRAPHICS_SCALE / 2;
};

Background.prototype.render = function( graphics )
{
};