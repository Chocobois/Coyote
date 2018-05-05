
function Terrain ()
{
}

Terrain.prototype.create = function ( x, y )
{
	this.ground = Global.physics.createBody();
	this.groundFixtureDefinition = {
		density: 0.0,
		friction: 0.6
	}

	this.groundPoints = [
		Vec2(10, GAME_HEIGHT-10),
		Vec2(GAME_WIDTH/2, GAME_HEIGHT),
		Vec2(GAME_WIDTH-10, GAME_HEIGHT-10),
		Vec2(GAME_WIDTH-10 + 40*1, GAME_HEIGHT-10 + 4*0.25),
		Vec2(GAME_WIDTH-10 + 40*2, GAME_HEIGHT-10 + 4*1.0),
		Vec2(GAME_WIDTH-10 + 40*3, GAME_HEIGHT-10 + 4*4.0),
		Vec2(GAME_WIDTH-10 + 40*4, GAME_HEIGHT-10 + 4*0.0),
		Vec2(GAME_WIDTH-10 + 40*5, GAME_HEIGHT-10 + 4*0.0),
		Vec2(GAME_WIDTH-10 + 40*6, GAME_HEIGHT-10 + 4*-1.0),
		Vec2(GAME_WIDTH-10 + 40*7, GAME_HEIGHT-10 + 4*-2.0),
		Vec2(GAME_WIDTH-10 + 40*8, GAME_HEIGHT-10 + 4*-2.0),
		Vec2(GAME_WIDTH-10 + 40*9, GAME_HEIGHT-10 + 4*-1.25),
		Vec2(GAME_WIDTH-10 + 40*10, GAME_HEIGHT-10 + 4*0.0),
	];

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