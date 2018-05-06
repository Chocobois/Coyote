
var Global = Global || {};

Global.Game = function()
{
	this.step = 0;
	this.planckWorld = planck.World({ gravity: planck.Vec2(0, 100) });
	Global.physics = this.planckWorld;

	this.background = new Background();
	this.terrain = new Terrain();
	this.player = new Player();
};

Global.Game.prototype.create = function ()
{
	Global.game.stage.backgroundColor = '#eeeeee';
	// NOTE: The physics engine might fuck up if we scale it
	// So scale the renderer instead
	this.game.world.scale.set(GRAPHICS_SCALE, GRAPHICS_SCALE);

	Global.game.world.setBounds( 0, 0, WORLD_WIDTH, WORLD_HEIGHT );



	// Create background
	this.background.create();

	// Used for physics drawing
	this.graphics = Global.game.add.graphics(0, 0);

	// Create terrain
	this.terrain.create();

	// Create player object
	this.playerGroup = Global.game.add.physicsGroup();
	this.player.create(this.playerGroup, 20, 20);
};

Global.Game.prototype.preRender = function ()
{
	// Make it smooth, baby
	Global.game.camera.x = (this.player.sprite.x - GAME_WIDTH/2) * GRAPHICS_SCALE;
	Global.game.camera.y = (this.player.sprite.y - GAME_HEIGHT/2) * GRAPHICS_SCALE;
	Global.game.camera.x = Math.min(WORLD_WIDTH - SCREEN_WIDTH, Global.game.camera.x);
	Global.game.camera.y = Math.min(WORLD_HEIGHT - SCREEN_HEIGHT, Global.game.camera.y);
};

Global.Game.prototype.update = function ()
{
	this.background.update();
	this.terrain.update();
	this.player.update();

	this.planckWorld.step(1/60);
};


Global.Game.prototype.render = function ()
{
	/*for (var body = this.planckWorld.getBodyList(); body; body = body.getNext()) {
		for (var fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
		// draw or update fixture
		}
	}*/
	this.graphics.clear();
	this.graphics.beginFill(0xFF0000, 1);

	this.background.render(this.graphics);
	this.terrain.render(this.graphics);
	this.player.render(this.graphics);
};
