
function Terrain ()
{
}

Terrain.prototype.create = function ( x, y )
{
	this.ground = Global.physics.createBody();
	this.groundFixtureDefinition = {density: 0.0, friction: 0.6}

	var x = 100;
	var y = 100;
	this.groundPoints = [
		Vec2(-10, 5),
		Vec2(10, y),
		Vec2(GAME_WIDTH/2, y+10),
		Vec2(x, y),
		Vec2(x + 40*1, y + 4*0.25),
		Vec2(x + 40*2, y + 4*1.0),
		Vec2(x + 40*3, y + 4*4.0),
		Vec2(x + 40*4, y + 4*0.0),
		Vec2(x + 40*5, y + 4*0.0),
		Vec2(x + 40*6, y + 4*-1.0),
		Vec2(x + 40*7, y + 4*-2.0),
		Vec2(x + 40*8, y + 4*-2.0),
		Vec2(x + 40*9, y + 4*-1.25),
		Vec2(x + 40*10, y + 4*0.0),
	];
	for (var i = 0; i < 100; ++i) {
		this.groundPoints.push(Vec2(x + 40*(11+i), y + 20*Math.random()));
	}

	// Add ground points to physics
	for (var i = 0; i < this.groundPoints.length-1; ++i) {
		this.ground.createFixture(pl.Edge(
			this.groundPoints[i],
			this.groundPoints[i+1]
		), this.groundFixtureDefinition);
	}
};

Terrain.prototype.update = function()
{
};

Terrain.prototype.render = function( graphics )
{
	// Draw ground
	graphics.lineStyle(1, 0x884400, 1.0);
	for (var i = 0; i < this.groundPoints.length-1; ++i) {
		graphics.moveTo(this.groundPoints[i].x, this.groundPoints[i].y);
		graphics.lineTo(this.groundPoints[i+1].x, this.groundPoints[i+1].y);
	}
};