
var Global = Global || {};

Global.Game = function()
{
	this.step = 0;
	this.planckWorld = planck.World({ gravity: planck.Vec2(0, 10) });
};

var CIRCLE_RADIUS = 10;

Global.Game.prototype.create = function ()
{
	Global.game.stage.backgroundColor = '#eeeeee';
	// NOTE: The physics engine might fuck up if we scale it
	// So scale the renderer instead
	this.game.world.scale.set(GRAPHICS_SCALE, GRAPHICS_SCALE);

	this.graphics = Global.game.add.graphics(0, 0);
	this.circleBody = this.planckWorld.createDynamicBody(planck.Vec2(5, 5));
	this.circleBody.createFixture(planck.Circle(CIRCLE_RADIUS), { density: 1.0, friction: 0.9 });
	
	this.coyoteSprite = this.add.sprite(0, 0, "coyote");
	this.coyoteSprite.scale.set(0.1, 0.1);
	
	var ground = this.planckWorld.createBody();
	var groundFixtureDefinition = {
		density: 0.0,
		friction: 0.6
	}
	ground.createFixture(planck.Edge(
		planck.Vec2(0, GAME_HEIGHT),
		planck.Vec2(GAME_WIDTH, GAME_HEIGHT)
	), groundFixtureDefinition);
};

Global.Game.prototype.preRender = function ()
{
};

Global.Game.prototype.update = function ()
{
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
	var circlePos = this.circleBody.getPosition();
	this.graphics.drawCircle(circlePos.x, circlePos.y, CIRCLE_RADIUS * 2);
	
	// Draw ground
	this.graphics.lineStyle(1, 0x000000, 1.0);
	this.graphics.moveTo(0, GAME_HEIGHT);
	this.graphics.lineTo(GAME_WIDTH, GAME_HEIGHT);
	
	this.coyoteSprite.centerX = circlePos.x;
	this.coyoteSprite.centerY = circlePos.y;
};